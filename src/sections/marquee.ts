/**
 * marquee.ts — le bandeau boucle en CSS (fiable, sans JS aussi).
 * Amelioration : la vitesse et un leger cisaillement reagissent a la vitesse de scroll.
 * Coupe en reduced-motion (l'animation CSS est deja neutralisee par la media query).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

export function initMarquee(): void {
  if (prefersReducedMotion()) return;
  const tracks = document.querySelectorAll<HTMLElement>(".marquee__track");
  if (!tracks.length) return;

  const skewSetters = Array.from(tracks).map((t) => gsap.quickTo(t, "skewX", { duration: 0.5, ease: "power3.out" }));

  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -260);
      skewSetters.forEach((set) => set(v));
    },
  });
}
