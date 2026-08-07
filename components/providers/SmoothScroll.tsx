"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LENIS, prefersReducedMotion, onReducedMotionChange } from "@/lib/motion";

/**
 * Smooth scroll Lenis, branché sur le ticker GSAP et sur ScrollTrigger.
 *
 * Points d'accessibilité traités ici, car Lenis les casse par défaut :
 *  - ancres #id : interceptées et confiées à lenis.scrollTo
 *  - navigation clavier : Tab, Home/End, Espace, Page haut/bas restent natifs,
 *    et un focus reçu hors écran est rattrapé par lenis.scrollTo immédiat
 *  - prefers-reduced-motion : Lenis est détruit, le scroll natif reprend
 *    (avec scroll-behavior: smooth défini dans globals.css)
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let mounted = true;

    const destroy = () => {
      if (!lenisRef.current) return;
      gsap.ticker.remove(tick);
      lenisRef.current.destroy();
      lenisRef.current = null;
      ScrollTrigger.refresh();
    };

    function tick(time: number) {
      lenisRef.current?.raf(time * 1000);
    }

    const start = () => {
      if (!mounted || lenisRef.current || prefersReducedMotion()) return;

      const lenis = new Lenis({
        duration: LENIS.duration,
        easing: LENIS.easing,
        wheelMultiplier: LENIS.wheelMultiplier,
        touchMultiplier: LENIS.touchMultiplier,
        // Le clavier et les barres de défilement restent natifs : on ne
        // détourne que la molette et le tactile.
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };

    start();
    const offPref = onReducedMotionChange((reduced) => {
      if (reduced) destroy();
      else start();
    });

    /* --- Ancres internes ------------------------------------------------ */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, "", id);

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target as HTMLElement, { offset: 0 });
      } else {
        (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }
      // L'ancre doit aussi déplacer le focus, sinon le clavier reste en arrière.
      const el = target as HTMLElement;
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };

    /* --- Focus reçu hors écran ------------------------------------------ */
    const onFocusIn = (e: FocusEvent) => {
      const lenis = lenisRef.current;
      const el = e.target as HTMLElement | null;
      if (!lenis || !el || typeof el.getBoundingClientRect !== "function") return;
      const rect = el.getBoundingClientRect();
      const offscreen = rect.top < 0 || rect.bottom > window.innerHeight;
      if (offscreen) lenis.scrollTo(el, { immediate: true, offset: -120 });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      mounted = false;
      offPref();
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      destroy();
    };
  }, []);

  return <>{children}</>;
}
