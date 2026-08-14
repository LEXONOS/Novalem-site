/**
 * header.ts — header adaptatif (verre au scroll) + menu mobile plein ecran.
 * Le blocage du scroll passe par lockScroll() (Lenis.stop / classe CSS), jamais overflow:hidden direct.
 */
import { lockScroll } from "../lib/scroll";

export function initHeader(): void {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (!nav || !burger || !menu) return;

  // --- verre au scroll ---
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- menu mobile ---
  const setOpen = (open: boolean) => {
    menu.classList.toggle("open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    lockScroll(open);
    if (open) {
      // focus sur le 1er lien pour le clavier
      menu.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));

  // fermer au clic d'un lien
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setOpen(false))
  );

  // fermer avec Echap
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      burger.focus();
    }
  });
}
