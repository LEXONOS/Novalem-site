/**
 * main.ts — point d'entree. Amelioration progressive :
 * le HTML est complet et lisible sans JS ; ici on ajoute mouvement, son et interactions.
 */
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/main.css";

import { armReveals, initReveals } from "./lib/reveal";
import { initScroll } from "./lib/scroll";
import { initMagnetic } from "./lib/magnetic";
import { initSound } from "./lib/sound";
import { initHeader } from "./sections/header";
import { initHero } from "./sections/hero";
import { initMarquee } from "./sections/marquee";
import { initRealisations } from "./sections/realisations";
import { initMethode } from "./sections/methode";
import { initAtelier } from "./sections/atelier";
import { initContact } from "./sections/contact";

// Arme l'etat "cache" des revelations le plus tot possible (evite le flash).
armReveals();

function boot(): void {
  // Ordre : header d'abord (toujours utile), puis scroll, puis animations.
  initHeader();
  initScroll();
  initHero();
  initReveals();
  initMarquee();
  initMagnetic();
  initRealisations();
  initMethode();
  initAtelier();
  initContact();
  initSound();

  // Preloader NON bloquant : on le retire des que pret, avec sortie de secours.
  hidePreloader();
}

function hidePreloader(): void {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  const done = () => pre.classList.add("is-done");
  // sortie normale
  window.requestAnimationFrame(() => window.setTimeout(done, 260));
  // securite : quoi qu'il arrive, on ne bloque jamais
  window.setTimeout(done, 1600);
  pre.addEventListener("transitionend", () => pre.remove(), { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
