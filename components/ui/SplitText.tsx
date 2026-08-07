"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import {
  DURATION,
  STAGGER,
  SCROLL,
  GSAP_EASE,
  clampDuration,
  prefersReducedMotion,
  type EaseName,
} from "@/lib/motion";
import { cn } from "@/lib/cn";

type SplitBy = "lines" | "words" | "chars";

export interface SplitTextProps {
  /** Texte brut. Pas de JSX : la découpe se fait sur des nœuds texte. */
  children: string;
  by?: SplitBy;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  stagger?: number;
  /** Décalage ScrollTrigger. Voir SCROLL dans lib/motion. */
  start?: string;
  /** Déclenche au montage au lieu du scroll. Pour le hero. */
  immediate?: boolean;
  id?: string;
}

const DEFAULT_STAGGER: Record<SplitBy, number> = {
  chars: STAGGER.tight,
  words: STAGGER.base,
  lines: STAGGER.loose,
};

/** Enveloppe un élément dans un masque inline et renvoie le masque. */
function wrapInline(el: HTMLElement): HTMLElement {
  const mask = document.createElement("span");
  mask.className = "mask-inline";
  el.parentNode?.insertBefore(mask, el);
  mask.appendChild(el);
  return mask;
}

/** Découpe le texte en spans de mots, en conservant de vrais espaces. */
function buildWords(host: HTMLElement, text: string): HTMLElement[] {
  host.textContent = "";
  const frag = document.createDocumentFragment();
  const words: HTMLElement[] = [];

  text.split(/(\s+)/).forEach((chunk) => {
    if (chunk === "") return;
    if (/^\s+$/.test(chunk)) {
      // Espace réel : le retour à la ligne naturel du navigateur est préservé,
      // donc la découpe n'introduit aucun layout shift.
      frag.appendChild(document.createTextNode(chunk));
      return;
    }
    const span = document.createElement("span");
    span.className = "sp-word";
    span.textContent = chunk;
    frag.appendChild(span);
    words.push(span);
  });

  host.appendChild(frag);
  return words;
}

export function SplitText({
  children,
  by = "lines",
  as: Tag = "p",
  className,
  delay = 0,
  duration = DURATION.slow,
  ease = "expoOut",
  stagger,
  start = SCROLL.start,
  immediate = false,
  id,
}: SplitTextProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  // Empêche la relance de la découpe à chaque rendu de React.
  const [text] = useState(children);

  useIsoLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (prefersReducedMotion()) {
      host.textContent = text;
      return;
    }

    const ctx = gsap.context(() => {
      let targets: HTMLElement[] = [];

      const split = () => {
        const words = buildWords(host, text);

        if (by === "words") {
          targets = words.map((w) => {
            wrapInline(w);
            return w;
          });
          return;
        }

        if (by === "chars") {
          const chars: HTMLElement[] = [];
          words.forEach((word) => {
            const letters = Array.from(word.textContent ?? "");
            word.textContent = "";
            letters.forEach((letter) => {
              const span = document.createElement("span");
              span.className = "sp-char";
              span.textContent = letter;
              const mask = document.createElement("span");
              mask.className = "mask-inline";
              mask.appendChild(span);
              word.appendChild(mask);
              chars.push(span);
            });
          });
          targets = chars;
          return;
        }

        // lines : on regroupe les mots par position verticale, puis on
        // reconstruit une ligne = un masque + un contenu translaté.
        const lines: HTMLElement[][] = [];
        let lastTop: number | null = null;
        words.forEach((w) => {
          const top = w.offsetTop;
          if (lastTop === null || Math.abs(top - lastTop) > 1) {
            lines.push([]);
            lastTop = top;
          }
          lines[lines.length - 1].push(w);
        });

        const frag = document.createDocumentFragment();
        const inners: HTMLElement[] = [];
        lines.forEach((line) => {
          const mask = document.createElement("span");
          mask.className = "mask";
          const inner = document.createElement("span");
          inner.className = "sp-line";
          line.forEach((w, i) => {
            if (i > 0) inner.appendChild(document.createTextNode(" "));
            inner.appendChild(w);
          });
          mask.appendChild(inner);
          frag.appendChild(mask);
          inners.push(inner);
        });
        host.textContent = "";
        host.appendChild(frag);
        targets = inners;
      };

      split();

      // Le texte reste lisible par les lecteurs d'écran via aria-label,
      // les fragments générés sont ignorés.
      host.setAttribute("aria-label", text);

      const tween = () =>
        gsap.fromTo(
          targets,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: clampDuration(duration),
            ease: GSAP_EASE[ease],
            delay,
            stagger: stagger ?? DEFAULT_STAGGER[by],
            scrollTrigger: immediate
              ? undefined
              : { trigger: host, start, once: SCROLL.once },
          },
        );

      let anim = tween();

      // Le regroupement en lignes dépend de la largeur : on redécoupe au
      // resize, uniquement si la largeur change (ignore la barre mobile).
      if (by === "lines") {
        let lastWidth = window.innerWidth;
        const onResize = () => {
          if (window.innerWidth === lastWidth) return;
          lastWidth = window.innerWidth;
          anim.scrollTrigger?.kill();
          anim.kill();
          split();
          anim = tween();
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      }
    }, hostRef);

    return () => {
      ctx.revert();
      host.textContent = text;
      host.removeAttribute("aria-label");
      ScrollTrigger.refresh();
    };
  }, [text, by, delay, duration, ease, stagger, start, immediate]);

  return (
    <Tag
      id={id}
      ref={hostRef as React.Ref<never>}
      className={cn("block", className)}
      suppressHydrationWarning
    >
      {text}
    </Tag>
  );
}

export default SplitText;
