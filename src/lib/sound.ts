/**
 * sound.ts — sons d'interface ORIGINAUX, synthese Web Audio (aucun fichier).
 * Palette : survol, clic, revelation, carillon d'entree.
 * - Demarrage au premier geste utilisateur (politique autoplay des navigateurs).
 * - Bouton on/off, etat memorise (localStorage).
 * - Coupe si prefers-reduced-motion.
 * Esprit tekiyo, sons recrees a nous : timbres doux, courts, discrets.
 */
import { prefersReducedMotion } from "./motion";

type SoundName = "hover" | "click" | "reveal" | "chime";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private unlocked = false;
  private lastHover = 0;

  constructor() {
    // Par defaut : coupe si mouvement reduit, sinon on lit la preference memorisee.
    const stored = localStorage.getItem("sn-sound");
    this.enabled = prefersReducedMotion() ? false : stored === "on";
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  /** Prepare le contexte au premier geste (clic/clavier/touch). */
  unlock(): void {
    if (this.unlocked || prefersReducedMotion()) return;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0001;
      this.master.connect(this.ctx.destination);
      this.unlocked = true;
      // carillon discret si le son est deja actif
      if (this.enabled) this.play("chime");
    } catch {
      this.ctx = null;
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem("sn-sound", this.enabled ? "on" : "off");
    if (this.enabled) {
      this.unlock();
      this.play("chime");
    }
    return this.enabled;
  }

  play(name: SoundName): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    // anti-spam du survol
    if (name === "hover") {
      const now = performance.now();
      if (now - this.lastHover < 60) return;
      this.lastHover = now;
    }
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const voice = (
      freq: number,
      dur: number,
      type: OscillatorType,
      gain: number,
      glideTo?: number
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur * 0.9);
      // enveloppe douce
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(this.master!);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    };

    switch (name) {
      case "hover":
        voice(880, 0.07, "sine", 0.05);
        break;
      case "click":
        voice(523.25, 0.12, "triangle", 0.09, 784);
        break;
      case "reveal":
        voice(392, 0.5, "sine", 0.04, 587.33);
        break;
      case "chime":
        // petit accord ascendant (do - mi - sol)
        voice(523.25, 0.6, "sine", 0.05);
        setTimeout(() => voice(659.25, 0.55, "sine", 0.045), 90);
        setTimeout(() => voice(783.99, 0.7, "sine", 0.05), 190);
        break;
    }
    // relance le master (au cas ou suspendu)
    if (this.master.gain.value < 0.5) {
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(0.9, t);
    }
    if (ctx.state === "suspended") ctx.resume();
  }
}

export const sound = new SoundEngine();

/** Branche l'UI du son : deverrouillage au 1er geste, bouton on/off, sons de survol/clic. */
export function initSound(): void {
  const toggleBtn = document.getElementById("sound-toggle");

  const unlockOnce = () => {
    sound.unlock();
    window.removeEventListener("pointerdown", unlockOnce);
    window.removeEventListener("keydown", unlockOnce);
  };
  window.addEventListener("pointerdown", unlockOnce, { once: false });
  window.addEventListener("keydown", unlockOnce, { once: false });

  const syncBtn = () => {
    if (!toggleBtn) return;
    const on = sound.isEnabled;
    toggleBtn.setAttribute("aria-pressed", String(on));
    toggleBtn.dataset.on = String(on);
    toggleBtn.setAttribute("aria-label", on ? "Couper les sons" : "Activer les sons");
  };
  syncBtn();

  toggleBtn?.addEventListener("click", () => {
    sound.toggle();
    syncBtn();
  });

  // sons de survol/clic sur les cibles marquees [data-sfx]
  document.addEventListener(
    "pointerenter",
    (e) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-sfx]");
      if (el) sound.play("hover");
    },
    true
  );
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement)?.closest?.("[data-sfx]");
    if (el) sound.play("click");
  });
}
