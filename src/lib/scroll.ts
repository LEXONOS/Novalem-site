/**
 * scroll.ts — cablage Lenis <-> GSAP ScrollTrigger.
 *
 * REGLE IMPERATIVE : le scroll doit TOUJOURS marcher.
 * - Lenis n'est active que si le mouvement n'est pas reduit ET le pointeur/OS le permet.
 * - Sinon : scroll natif pur (aucune interception).
 * - Les ancres et la navigation clavier ne doivent jamais casser.
 */
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/** Initialise le smooth scroll et le synchronise avec ScrollTrigger. */
export function initScroll(): void {
  const reduce = prefersReducedMotion();

  // En mouvement reduit : pas de smooth scroll du tout. Scroll natif, ancres natives.
  if (reduce) {
    setupAnchorsNative();
    return;
  }

  lenis = new Lenis({
    duration: 1.1,
    // easing doux facon expoOut
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // on laisse le tactile en natif : plus fiable et plus reactif sur mobile
    syncTouch: false,
    touchMultiplier: 1.6,
  });

  // ScrollTrigger lit la position via l'evenement de Lenis
  lenis.on("scroll", ScrollTrigger.update);

  // Un seul RAF pilote Lenis (en secondes -> ms)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  setupAnchorsLenis();

  // Recalcule apres chargement des polices/images (evite les decalages de trigger)
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/** Stoppe/relance le scroll (menu mobile) sans jamais poser overflow:hidden sur body via JS ailleurs. */
export function lockScroll(locked: boolean): void {
  if (lenis) {
    locked ? lenis.stop() : lenis.start();
  }
  // Repli natif : classe utilitaire geree en CSS
  document.documentElement.classList.toggle("scroll-locked", locked);
}

/** Defilement doux vers une ancre. */
export function scrollTo(target: string | HTMLElement): void {
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.2 });
  } else {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/* --- Ancres --- */
function setupAnchorsLenis(): void {
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement)?.closest?.(
      'a[href^="#"]'
    ) as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    scrollTo(el);
    // met a jour l'URL sans saut brutal
    history.pushState(null, "", id);
  });
}

// En mode natif, on garde le comportement par defaut du navigateur (fiable, clavier OK).
function setupAnchorsNative(): void {
  /* rien : les ancres HTML natives suffisent, scroll-behavior gere le reste. */
}
