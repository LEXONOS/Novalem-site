/**
 * NOVALEM — système de motion.
 *
 * Source de vérité unique pour toutes les animations du site.
 * Aucun composant ne définit sa propre courbe ni sa propre durée.
 *
 * Règles appliquées partout :
 *  - tout ce qui entre à l'écran monte depuis le bas, dans un masque
 *    overflow:hidden. Jamais d'opacity nue.
 *  - aucune animation ne dépasse DURATION.cinematic (1.6s).
 *  - transform et opacity uniquement.
 *  - prefers-reduced-motion coupe tout mouvement.
 */

/* ---------------------------------------------------------------- EASINGS */

type Bezier = readonly [number, number, number, number];

export const EASE = {
  /** Sortie très rapide puis glisse. Défaut pour les révélations. */
  expoOut: [0.16, 1, 0.3, 1] as Bezier,
  /** Un peu plus doux que expoOut. Micro-interactions, survols. */
  power4Out: [0.165, 0.84, 0.44, 1] as Bezier,
  /** Accélère lentement, s'arrête net. Grands mouvements, transitions de page. */
  silk: [0.65, 0.05, 0, 1] as Bezier,
} as const;

export type EaseName = keyof typeof EASE;

/** Chaîne CSS prête à l'emploi (transition-timing-function). */
export const cssEase = (e: Bezier) => `cubic-bezier(${e.join(", ")})`;

export const EASE_CSS: Record<EaseName, string> = {
  expoOut: cssEase(EASE.expoOut),
  power4Out: cssEase(EASE.power4Out),
  silk: cssEase(EASE.silk),
};

/**
 * Convertit une courbe de Bézier en fonction d'easing.
 * GSAP accepte une fonction (p: number) => number comme ease : pas besoin
 * du plugin CustomEase, et les mêmes courbes servent en CSS et en JS.
 */
export function bezierEase([x1, y1, x2, y2]: Bezier) {
  const a = (u: number, v: number) => 1 - 3 * v + 3 * u;
  const b = (u: number, v: number) => 3 * v - 6 * u;
  const c = (u: number) => 3 * u;
  const calc = (t: number, u: number, v: number) =>
    ((a(u, v) * t + b(u, v)) * t + c(u)) * t;
  const slope = (t: number, u: number, v: number) =>
    3 * a(u, v) * t * t + 2 * b(u, v) * t + c(u);

  return (p: number): number => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 8; i += 1) {
      const dx = calc(t, x1, x2) - p;
      if (Math.abs(dx) < 1e-6) break;
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    return calc(t, y1, y2);
  };
}

/** Easings au format GSAP. */
export const GSAP_EASE = {
  expoOut: bezierEase(EASE.expoOut),
  power4Out: bezierEase(EASE.power4Out),
  silk: bezierEase(EASE.silk),
} as const;

/* --------------------------------------------------------------- DURATIONS */

export const DURATION = {
  /** Retours immédiats : bascule d'état, focus. */
  instant: 0.15,
  /** Survols, micro-interactions. */
  fast: 0.3,
  /** Défaut. Révélations au scroll. */
  base: 0.6,
  /** Grands blocs, titres display. */
  slow: 1.0,
  /** Plafond absolu. Séquence d'ouverture uniquement. */
  cinematic: 1.6,
} as const;

export const MAX_DURATION = DURATION.cinematic;

/** Garde-fou : rien ne dépasse 1.6s, même par erreur de calcul. */
export const clampDuration = (d: number) => Math.min(d, MAX_DURATION);

/* ----------------------------------------------------------------- STAGGER */

export const STAGGER = {
  /** Caractères. */
  tight: 0.04,
  /** Mots, éléments de liste. */
  base: 0.08,
  /** Lignes, cartes, grandes zones. */
  loose: 0.14,
} as const;

/* ------------------------------------------------------------ SCROLLTRIGGER */

/** Réglages ScrollTrigger par défaut. Une révélation ne se rejoue pas. */
export const SCROLL = {
  start: "top 85%",
  /** Pour les blocs pleine hauteur qui doivent partir plus tôt. */
  startEarly: "top 92%",
  once: true,
} as const;

/* ------------------------------------------------- PREFERS-REDUCED-MOTION */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** S'abonne aux changements de préférence. Retourne la fonction de nettoyage. */
export function onReducedMotionChange(cb: (reduced: boolean) => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

/* ---------------------------------------------------------------- VARIANTS */

type TweenVars = Record<string, unknown>;

export interface RevealOptions {
  duration?: number;
  ease?: EaseName;
  delay?: number;
  stagger?: number;
}

/**
 * Révélation par masque. Le parent porte .mask (overflow hidden),
 * l'enfant monte de --rise à 0.
 */
export const maskReveal = (o: RevealOptions = {}) => ({
  from: { yPercent: 112 } as TweenVars,
  to: {
    yPercent: 0,
    duration: clampDuration(o.duration ?? DURATION.slow),
    ease: GSAP_EASE[o.ease ?? "expoOut"],
    delay: o.delay ?? 0,
    stagger: o.stagger,
  } as TweenVars,
});

/**
 * Montée en fondu. Le seul cas où l'opacity est autorisée, et toujours
 * accompagnée d'un déplacement : jamais d'opacity nue.
 */
export const fadeUp = (o: RevealOptions & { distance?: number } = {}) => ({
  from: { y: o.distance ?? 24, autoAlpha: 0 } as TweenVars,
  to: {
    y: 0,
    autoAlpha: 1,
    duration: clampDuration(o.duration ?? DURATION.base),
    ease: GSAP_EASE[o.ease ?? "expoOut"],
    delay: o.delay ?? 0,
    stagger: o.stagger,
  } as TweenVars,
});

/** Révélation caractère par caractère. Titres courts uniquement. */
export const charReveal = (o: RevealOptions = {}) => ({
  from: { yPercent: 112 } as TweenVars,
  to: {
    yPercent: 0,
    duration: clampDuration(o.duration ?? DURATION.slow),
    ease: GSAP_EASE[o.ease ?? "expoOut"],
    delay: o.delay ?? 0,
    stagger: o.stagger ?? STAGGER.tight,
  } as TweenVars,
});

/** Révélation mot par mot. */
export const wordReveal = (o: RevealOptions = {}) => ({
  from: { yPercent: 112 } as TweenVars,
  to: {
    yPercent: 0,
    duration: clampDuration(o.duration ?? DURATION.slow),
    ease: GSAP_EASE[o.ease ?? "expoOut"],
    delay: o.delay ?? 0,
    stagger: o.stagger ?? STAGGER.base,
  } as TweenVars,
});

/** Révélation ligne par ligne. Défaut pour les paragraphes et gros titres. */
export const lineReveal = (o: RevealOptions = {}) => ({
  from: { yPercent: 112 } as TweenVars,
  to: {
    yPercent: 0,
    duration: clampDuration(o.duration ?? DURATION.slow),
    ease: GSAP_EASE[o.ease ?? "expoOut"],
    delay: o.delay ?? 0,
    stagger: o.stagger ?? STAGGER.loose,
  } as TweenVars,
});

/** Trait horizontal qui se déploie de la gauche. scaleX only, zéro reflow. */
export const ruleReveal = (o: RevealOptions = {}) => ({
  from: { scaleX: 0 } as TweenVars,
  to: {
    scaleX: 1,
    duration: clampDuration(o.duration ?? DURATION.cinematic),
    ease: GSAP_EASE[o.ease ?? "silk"],
    delay: o.delay ?? 0,
    stagger: o.stagger,
  } as TweenVars,
});

export const VARIANTS = {
  maskReveal,
  fadeUp,
  charReveal,
  wordReveal,
  lineReveal,
  ruleReveal,
} as const;

export type VariantName = keyof typeof VARIANTS;

/* -------------------------------------------------------------- MAGNETIQUE */

export const MAGNETIC = {
  /** Fraction du déplacement du curseur reprise par le bouton. */
  strength: 0.28,
  /** Rayon d'attraction en px autour du bouton. */
  radius: 90,
  /** Durée du suivi et du retour. */
  follow: DURATION.fast,
  release: DURATION.base,
} as const;

/* ----------------------------------------------------------------- MARQUEE */

export const MARQUEE = {
  /** Vitesse en pixels par seconde. */
  speed: 60,
  /** Facteur de timeScale au survol (0 = arrêt franc). */
  hoverScale: 0,
  /** Durée du ralentissement au survol. */
  ease: DURATION.fast,
} as const;

/* ------------------------------------------------------------------ LENIS */

export const LENIS = {
  duration: 1.1,
  /** Même famille de courbe que expoOut, en version amortie. */
  easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
} as const;
