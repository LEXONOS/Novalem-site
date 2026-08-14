/**
 * motion.ts — jetons de mouvement, source unique cote JS.
 * Miroir des variables --e-* / --d-* de tokens.css.
 * On ne code jamais une duree ou un easing en dur ailleurs.
 */

export const EASE = {
  expo: "expo.out", // grands mouvements (equiv. cubic-bezier .16,1,.3,1)
  power: "power4.out", // sorties nettes
  silk: "power3.inOut", // balancier profond
  out: "power2.out", // micro-interactions
} as const;

// cubic-bezier bruts pour les usages hors GSAP (WAAPI, transitions inline)
export const CUBIC = {
  expo: [0.16, 1, 0.3, 1],
  power: [0.22, 1, 0.36, 1],
  silk: [0.65, 0.05, 0, 1],
  out: [0.33, 1, 0.68, 1],
} as const;

export const DUR = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  cine: 1.6,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** Vrai si l'utilisateur demande une reduction du mouvement. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Pointeur fin (souris) disponible : conditionne magnetisme, parallaxe fine. */
export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(hover: hover)").matches
  );
}
