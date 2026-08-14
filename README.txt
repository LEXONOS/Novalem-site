STUDIO NOVALEM — SITE (projet organise)
=======================================
studio-novalem-final/
  index.html                 -> la page (structure seule, propre et lisible)
  assets/css/style.css       -> tout le design
  assets/js/site.js          -> menu, apparitions au scroll, sons, secours du portrait
  (supprime : portrait desormais en image fixe)
  assets/img/louis-particles.png -> portrait de Louis en particules (image fixe)
  assets/img/poster.jpg      -> image d'attente de la video du hero
  assets/img/emblem.svg      -> l'embleme du logo
  assets/video/hero.mp4      -> video du hero (encre bleue)
  assets/video/neon.mp4      -> fond video du panneau contact

IMPORTANT : toujours garder index.html et le dossier assets ENSEMBLE.
Tester en local : ouvrir index.html dans Chrome (double-clic).
Si jamais les particules ne demarrent pas, le site affiche automatiquement
le portrait statique au bout de 4 secondes : la section n'est jamais vide.

MISE EN LIGNE
- OVH via FileZilla : envoyer index.html + le dossier assets a la racine (www/).
- Vercel / Netlify : glisser le dossier studio-novalem-final entier.
