"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { MARQUEE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface MarqueeRowProps {
  items: React.ReactNode[];
  /** Pixels par seconde. */
  speed?: number;
  direction?: "left" | "right";
  /** Séparateur inséré entre les éléments. */
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  /** Fondu latéral vers le fond de la section. */
  fade?: boolean;
  "aria-label"?: string;
}

/**
 * Défilement infini. Deux copies du contenu, translation de -50 % en boucle :
 * la reprise est invisible et la piste ne se re-mesure jamais en cours de route.
 * La copie est aria-hidden pour ne pas doubler la lecture d'écran.
 */
export function MarqueeRow({
  items,
  speed = MARQUEE.speed,
  direction = "left",
  separator,
  className,
  itemClassName,
  fade = true,
  "aria-label": ariaLabel,
}: MarqueeRowProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const build = () => {
        tweenRef.current?.kill();
        gsap.set(track, { x: 0 });
        const half = track.scrollWidth / 2;
        if (half <= 0) return;
        tweenRef.current = gsap.to(track, {
          x: direction === "left" ? -half : half,
          duration: half / speed,
          ease: "none",
          repeat: -1,
        });
        if (direction === "right") gsap.set(track, { x: -half });
      };

      build();

      const ro = new ResizeObserver(() => build());
      ro.observe(viewport);

      const enter = () =>
        gsap.to(tweenRef.current!, {
          timeScale: MARQUEE.hoverScale,
          duration: DURATION.fast,
        });
      const leave = () =>
        gsap.to(tweenRef.current!, { timeScale: 1, duration: DURATION.fast });

      viewport.addEventListener("pointerenter", enter);
      viewport.addEventListener("pointerleave", leave);
      viewport.addEventListener("focusin", enter);
      viewport.addEventListener("focusout", leave);

      return () => {
        ro.disconnect();
        viewport.removeEventListener("pointerenter", enter);
        viewport.removeEventListener("pointerleave", leave);
        viewport.removeEventListener("focusin", enter);
        viewport.removeEventListener("focusout", leave);
      };
    }, viewportRef);

    return () => ctx.revert();
  }, [items, speed, direction]);

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className={cn("flex shrink-0 items-center", itemClassName)}>
          {item}
          {separator ?? (
            <span aria-hidden="true" className="mx-8 text-or-500 md:mx-12">
              &#9670;
            </span>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={viewportRef}
      aria-label={ariaLabel}
      className={cn(
        "relative w-full overflow-hidden",
        // Le fondu latéral se fait au masque : pas de dégradé peint par-dessus.
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        // En mouvement réduit, la piste devient une bande défilable au doigt.
        "motion-reduce:overflow-x-auto",
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default MarqueeRow;
