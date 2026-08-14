/**
 * methode.ts — ligne de progression qui se trace au scroll (4 etapes).
 * Repli : en reduced-motion la ligne est pleine, les etapes visibles.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

export function initMethode(): void {
  const section = document.getElementById("methode");
  const line = section?.querySelector<HTMLElement>(".steps__progress-fill");
  const steps = section?.querySelectorAll<HTMLElement>(".step");
  if (!section || !line || !steps || steps.length === 0) return;

  if (prefersReducedMotion()) {
    line.style.transform = "scaleY(1)";
    steps.forEach((s) => s.classList.add("is-active"));
    return;
  }

  // trace la ligne verticale (desktop) / horizontale geree en CSS via transform-origin
  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 75%",
        scrub: 1,
      },
    }
  );

  // active chaque etape a son passage
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 72%",
      onEnter: () => step.classList.add("is-active"),
      onLeaveBack: () => step.classList.remove("is-active"),
    });
  });
}
