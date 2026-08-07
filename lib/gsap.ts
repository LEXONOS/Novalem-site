"use client";

import { useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Lenis pilote le rAF : ScrollTrigger ne doit pas se resynchroniser tout seul.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * useLayoutEffect côté client, useEffect côté serveur.
 * Indispensable : l'état initial d'une animation doit être posé avant le
 * premier paint, sinon on voit le texte non animé pendant une frame.
 */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger };
