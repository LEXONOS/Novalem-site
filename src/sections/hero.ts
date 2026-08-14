/**
 * hero.ts — sequence d'entree du hero, jouee AU CHARGEMENT (pas au scroll).
 * Le contenu au-dessus de la ligne de flottaison ne doit jamais attendre un scroll.
 * Repli : en reduced-motion, tout est deja visible (js-reveals retire ailleurs).
 */
import { gsap } from "gsap";
import { EASE, DUR, STAGGER, prefersReducedMotion } from "../lib/motion";

export function initHero(): void {
  const hero = document.getElementById("hero");
  if (!hero) return;

  if (prefersReducedMotion()) {
    // Rien a animer : on s'assure juste que tout est visible.
    hero.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.querySelectorAll<HTMLElement>(":scope > *").forEach((c) => (c.style.transform = "none"));
    });
    return;
  }

  const eyebrow = hero.querySelector<HTMLElement>(".eyebrow");
  const lines = hero.querySelectorAll<HTMLElement>(".hero__title .line > span");
  const ups = hero.querySelectorAll<HTMLElement>(
    ".hero__sub, .hero__actions, .hero__meta"
  );
  const cue = hero.querySelector<HTMLElement>(".hero__cue");

  // etats initiaux (le CSS js-reveals a deja cache ; on fixe des valeurs nettes)
  gsap.set([eyebrow, ...ups], { opacity: 0, y: 24 });
  gsap.set(lines, { yPercent: 110 });
  if (cue) gsap.set(cue, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
  tl.to(eyebrow, { opacity: 1, y: 0, duration: DUR.base }, 0.1)
    .to(lines, { yPercent: 0, duration: DUR.slow, stagger: STAGGER.base }, 0.15)
    .to(ups, { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.base }, 0.4)
    .to(cue, { opacity: 1, duration: DUR.base }, 0.9);
}
