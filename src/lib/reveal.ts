/**
 * reveal.ts — revelations au scroll (progressive enhancement).
 *
 * Principe anti-echec : le contenu est VISIBLE par defaut (CSS).
 * On ajoute la classe `js-reveals` sur <html> AVANT le premier paint uniquement
 * si le JS tourne et que le mouvement n'est pas reduit ; alors on cache puis on
 * revele au scroll. Si le JS plante, rien n'est cache.
 *
 * Attributs pris en charge :
 *   data-reveal="up"    -> fondu + montee douce
 *   data-reveal="mask"  -> l'enfant (texte) monte sous un masque overflow:hidden
 *   data-reveal-stagger -> anime les enfants directs en cascade
 *   data-reveal-delay="0.1" -> retard en secondes
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, DUR, STAGGER, prefersReducedMotion } from "./motion";

export function armReveals(): void {
  // Marque le document : autorise l'etat cache initial (defini en CSS).
  document.documentElement.classList.add("js-reveals");
}

export function initReveals(): void {
  if (prefersReducedMotion()) {
    // Sécurité : on retire l'etat cache, tout reste affiche.
    document.documentElement.classList.remove("js-reveals");
    return;
  }

  // Le hero est anime au chargement par initHero() : on l'exclut du scroll.
  const items = gsap
    .utils.toArray<HTMLElement>("[data-reveal]")
    .filter((el) => !el.closest("#hero"));
  items.forEach((el) => {
    const kind = el.dataset.reveal || "up";
    const delay = parseFloat(el.dataset.revealDelay || "0");
    const stagger = el.hasAttribute("data-reveal-stagger");

    const st = {
      trigger: el,
      start: "top 86%",
      toggleActions: "play none none none",
    } as const;

    if (kind === "mask") {
      const targets = (el.children.length ? Array.from(el.children) : [el]) as HTMLElement[];
      gsap.set(el, { opacity: 1 });
      gsap.set(targets, { yPercent: 110 });
      gsap.to(targets, {
        yPercent: 0,
        duration: DUR.slow,
        ease: EASE.expo,
        delay,
        stagger: stagger ? STAGGER.base : 0,
        scrollTrigger: st,
      });
    } else if (stagger) {
      // le parent reste visible (on efface le decalage pose par le CSS), ses enfants montent en cascade
      gsap.set(el, { opacity: 1, y: 0 });
      gsap.set(el.children, { opacity: 0, y: 26 });
      gsap.to(el.children, {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE.expo,
        delay,
        stagger: STAGGER.base,
        scrollTrigger: st,
      });
    } else {
      gsap.set(el, { opacity: 0, y: 28 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE.expo,
        delay,
        scrollTrigger: st,
      });
    }
  });

  ScrollTrigger.refresh();

  // FAILSAFE : si un element reste cache (trigger rate, refresh manque), on le revele.
  // Garantit qu'aucun contenu ne disparait si le scroll/anim se comporte mal.
  window.setTimeout(() => {
    items.forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        gsap.set(el.children, { opacity: 1, yPercent: 0, y: 0 });
      }
    });
  }, 2600);
}
