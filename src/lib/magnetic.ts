/**
 * magnetic.ts — boutons magnetiques (desktop + pointeur fin uniquement).
 * Le contenu suit legerement la souris, retour elastique. Coupe en reduced-motion.
 * Cible : elements [data-magnetic]. On limite a 1-2 par ecran (regle du skill).
 */
import { gsap } from "gsap";
import { hasFinePointer, prefersReducedMotion } from "./motion";

export function initMagnetic(): void {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.3");
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1,0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1,0.4)" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", () => el.addEventListener("pointermove", onMove));
    el.addEventListener("pointerleave", () => {
      el.removeEventListener("pointermove", onMove);
      onLeave();
    });
  });
}
