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

export interface RuleProps {
  tone?: "porcelaine" | "or";
  delay?: number;
  duration?: number;
  ease?: EaseName;
  start?: string;
  immediate?: boolean;
  className?: string;
}

/** Trait de section. Se déploie en scaleX depuis la gauche, zéro reflow. */
export function Rule({
  tone = "porcelaine",
  delay = 0,
  duration = DURATION.cinematic,
  ease = "silk",
  start = SCROLL.start,
  immediate = false,
  className,
}: RuleProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: clampDuration(duration),
          ease: GSAP_EASE[ease],
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start, once: SCROLL.once },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, ease, start, immediate]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("rule", tone === "or" && "rule-or", className)}
    />
  );
}

export default Rule;
