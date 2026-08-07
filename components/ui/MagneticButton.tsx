"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { MAGNETIC, EASE_CSS, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  /** Or plein dès le repos. Le texte reste encre-900 : 6.7:1. */
  solid: "bg-or-500 text-encre-900 border-or-500",
  /** Défaut. Contour encre, remplissage or au survol. */
  outline: "bg-transparent text-encre-900 border-encre-900",
  /** Sans contour, pour les actions secondaires. */
  ghost: "bg-transparent text-encre-900 border-transparent",
};

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Rend un <a> au lieu d'un <button>. */
  href?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  variant = "outline",
  href,
  strength = MAGNETIC.strength,
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pas d'effet magnétique au doigt ni en mouvement réduit.
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, "x", {
        duration: MAGNETIC.follow,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(el, "y", {
        duration: MAGNETIC.follow,
        ease: "power3.out",
      });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: MAGNETIC.release,
          ease: "elastic.out(1, 0.5)",
        });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      // Le focus clavier annule tout décalage résiduel.
      el.addEventListener("blur", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("blur", onLeave);
      };
    }, ref);

    return () => ctx.revert();
  }, [strength]);

  const classes = cn(
    "group relative isolate inline-flex items-center justify-center gap-2.5",
    "overflow-hidden rounded-pill border",
    "px-8 py-4 text-caption font-medium uppercase tracking-[0.14em]",
    "will-change-transform select-none",
    "transition-colors duration-fast",
    VARIANTS[variant],
    className,
  );

  const content = (
    <>
      {/* Remplissage or qui monte du bas. scaleY seul, jamais de height. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 origin-bottom scale-y-0",
          "transition-transform ease-[var(--ease-expo-out)]",
          "group-hover:scale-y-100 group-focus-visible:scale-y-100",
          "motion-reduce:transition-none",
          variant === "solid" ? "bg-or-400" : "bg-or-500",
        )}
        style={{ transitionDuration: "var(--duration-base)", transitionTimingFunction: EASE_CSS.expoOut }}
      />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}

export default MagneticButton;
