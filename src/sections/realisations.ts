/**
 * realisations.ts — apercus "live" de sites (iframe mise a l'echelle) + parallaxe douce.
 *
 * L'iframe rend le site reel a une largeur "desktop" (--frame-w) puis on le reduit
 * par transform:scale pour tenir dans la carte. On ne charge l'iframe que lorsque la
 * carte approche du viewport (perf + evite de charger des sites tiers trop tot).
 * Fallback : si l'iframe echoue / est bloquee, un poster reste visible dessous.
 */
import { gsap } from "gsap";
import { hasFinePointer, prefersReducedMotion } from "../lib/motion";

export function initRealisations(): void {
  const cards = document.querySelectorAll<HTMLElement>(".work[data-embed]");
  if (!cards.length) return;

  // 1) chargement paresseux des iframes
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        loadEmbed(card);
        io.unobserve(card);
      });
    },
    { rootMargin: "300px 0px" }
  );
  cards.forEach((c) => io.observe(c));

  // 2) parallaxe subtile de l'apercu (desktop, mouvement non reduit)
  if (!prefersReducedMotion() && hasFinePointer()) {
    cards.forEach((card) => {
      const media = card.querySelector<HTMLElement>(".work__media");
      if (!media) return;
      gsap.to(media, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }
}

function loadEmbed(card: HTMLElement): void {
  const holder = card.querySelector<HTMLElement>(".work__frame");
  const src = card.dataset.embed;
  if (!holder || !src || holder.querySelector("iframe")) return;

  const frameW = parseInt(card.dataset.frameW || "1440", 10);
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = card.dataset.title || "Apercu du site";
  iframe.loading = "lazy";
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("tabindex", "-1");
  iframe.setAttribute("aria-hidden", "true"); // decoratif : le lien reel est le titre/CTA
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
  iframe.style.width = frameW + "px";
  iframe.style.height = Math.round(frameW * 0.62) + "px";

  const applyScale = () => {
    const scale = holder.clientWidth / frameW;
    iframe.style.transform = `scale(${scale})`;
    holder.style.height = Math.round(frameW * 0.62 * scale) + "px";
  };

  iframe.addEventListener("load", () => card.classList.add("is-loaded"));
  holder.appendChild(iframe);
  applyScale();
  window.addEventListener("resize", applyScale, { passive: true });

  // Si le site tiers ne repond pas (X-Frame-Options), on garde le poster : timeout de secours.
  window.setTimeout(() => {
    if (!card.classList.contains("is-loaded")) card.classList.add("embed-failed");
  }, 6000);
}
