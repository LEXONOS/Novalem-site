# Studio Novalem — site vitrine

Site statique, 100 % autonome. Aucun build, aucune dépendance en ligne, aucun abonnement.
Tout tourne côté navigateur (HTML + CSS + JS). GSAP est embarqué en local dans `js/vendor/`.

## Mise en ligne (le plus simple)

Trois options, de la plus rapide à la plus « pro » :

1. **Netlify Drop** — va sur app.netlify.com/drop, glisse le dossier entier. En ligne en 30 secondes, gratuit. Tu branches `studionovalem.fr` ensuite dans Domain settings.
2. **Vercel** — vercel.com, « Add New Project », importe le dossier (ou glisse-le). Domaine perso dans Settings > Domains.
3. **OVH (hébergement mutualisé)** — via FileZilla, dépose le contenu du dossier (pas le dossier lui-même) dans `www/`. Le site répond direct sur ton domaine.

Dans tous les cas : c'est un site statique, donc rien à configurer côté serveur. `index.html` est le point d'entrée.

## Le formulaire de contact

Par défaut, le formulaire ouvre la messagerie du visiteur avec un message pré-rempli vers `contact@studionovalem.fr`. Ça marche partout, zéro back-end.

Si tu veux recevoir les messages directement dans ta boîte sans que le visiteur ait à valider dans son mail, passe par **Formspree** (gratuit jusqu'à 50 envois/mois) :
- crée un formulaire sur formspree.io, récupère ton ID
- dans `js/main.js`, fonction `setupForm`, remplace le bloc `mailto:` par un `fetch('https://formspree.io/f/TON_ID', { method:'POST', body: new FormData(form) })`

## Personnaliser

- **La vidéo du hero** : remplace `video/hero.mp4` (desktop) et `video/hero-mobile.mp4` (mobile) + l'image `video/hero-poster.jpg`. Garde les mêmes noms de fichiers. Idéalement une boucle courte, format identique (fond clair).
- **Le portrait en particules** (section « Le studio ») : c'est aujourd'hui une constellation générée qui dessine l'emblème nova, sans image. Si tu veux y mettre ton portrait en particules plus tard, on branche une image dans `js/constellation.js` (fonction d'échantillonnage) — dis-le moi et je te fais la version.
- **Les textes / tarifs** : tout est dans `index.html`, en clair. Les prix animés se mettent à jour via l'attribut `data-count` sur chaque `.num`.
- **Les réseaux** : les liens Instagram / TikTok dans le footer sont des placeholders, remplace les `href`.

## Nova (l'assistant)

L'orbe en bas à droite ouvre un assistant qui répond aux questions courantes (formules, délais, abonnement, méthode, contact). Les réponses sont **scriptées** (écrites en dur dans `js/nova-orb.js`), pas une vraie IA. C'est volontaire : zéro coût, zéro serveur, réponses maîtrisées. Pour le brancher sur un vrai modèle plus tard, il faudra un petit back-end (une fonction serverless) — on verra ça quand tu voudras.

## Le son d'interface

Petits sons synthétisés au survol / clic. **Coupé par défaut**, le visiteur l'active via le bouton son en bas. Le choix est mémorisé.

## Structure

```
index.html            page unique
css/styles.css        design system + toutes les sections
js/
  vendor/             GSAP + ScrollTrigger (local, à ne pas toucher)
  sound.js            sons d'interface
  nova-orb.js         orbe animée + assistant
  sky.js              ciel étoilé (section contact)
  constellation.js    particules emblème (section studio)
  main.js             préchargeur, header, révélations, compteurs, FAQ, formulaire
assets/               emblème + favicon (SVG)
video/                boucles hero + poster
```

Contact : contact@studionovalem.fr — +590 691 25 34 49
