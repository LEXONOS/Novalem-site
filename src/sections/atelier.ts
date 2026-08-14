/**
 * atelier.ts — portrait en particules de Louis.
 *
 * Integration & optimisation :
 * - Chargement PARESSEUX : l'iframe des particules (Canvas 2D + PNG embarque) n'est
 *   injectee que lorsque la section approche du viewport (IntersectionObserver).
 * - Repli REDUCED-MOTION / sans-JS : on n'injecte rien, un poster statique reste visible.
 * - Perf : l'iframe isole le canvas et son gros base64 du bundle principal.
 */
import { prefersReducedMotion } from "../lib/motion";

export function initAtelier(): void {
  const stage = document.getElementById("particles-stage");
  if (!stage) return;

  // Repli : mouvement reduit -> on laisse le poster, pas d'animation lourde.
  if (prefersReducedMotion()) {
    stage.classList.add("is-static");
    return;
  }

  const src = stage.dataset.src || "assets/louis-particles.html";
  let injected = false;

  const inject = () => {
    if (injected) return;
    injected = true;
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Portrait de Louis en particules";
    iframe.loading = "lazy";
    iframe.setAttribute("aria-hidden", "true");
    iframe.className = "particles__iframe";
    iframe.addEventListener("load", () => stage.classList.add("is-live"));
    stage.appendChild(iframe);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          inject();
          io.disconnect();
        }
      });
    },
    { rootMargin: "200px 0px" }
  );
  io.observe(stage);
}
