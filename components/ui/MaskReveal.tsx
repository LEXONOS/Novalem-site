"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import {
  DURATION,
  SCROLL,
  GSAP_EASE,
  clampDuration,
  prefersReducedMotion,
  type EaseName,
} from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface MaskRevealProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  start?: string;
  /** Anime au montage plutôt qu'au scroll. */
  immediate?: boolean;
  /** Anime les enfants directs un par un au lieu du bloc entier. */
  stagger?: number;
  as?: "div" | "span" | "li" | "figure";
}

/**
 * Révélation par masque. Le wrapper garde ses dimensions dès le premier
 * paint : aucun layout shift, seul le contenu se translate.
 */
export function MaskReveal({
  children,
  delay = 0,
  duration = DURATION.slow,
  ease = "expoOut",
  start = SCROLL.start,
  immediate = false,
  stagger,
  as = "div",
  className,
  ...rest
}: MaskRevealProps) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLDivElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const targets =
        stagger != null
          ? Array.from(inner.children as HTMLCollectionOf<HTMLElement>)
          : [inner];

      gsap.fromTo(
        targets,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: clampDuration(duration),
          ease: GSAP_EASE[ease],
          delay,
          stagger,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start, once: SCROLL.once },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, ease, start, immediate, stagger]);

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("mask", className)} {...rest}>
      <span className="block">{children}</span>
    </Tag>
  );
}

export default MaskReveal;
