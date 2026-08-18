# Studio Novalem — site vitrine

Site statique, codé à la main. Aucune dépendance, aucun build. On ouvre `index.html` et ça tourne.

## Contenu du projet

```
studio-novalem/
  index.html        le contenu et la structure
  css/style.css     tout le style (charte claire, verre, étoile nova)
  js/main.js        les animations (aurora, reveals, slider, compteurs, tilt...)
  assets/           favicon
  vercel.json       config de déploiement Vercel
  README.md         ce fichier
```

## Mettre en ligne sur Vercel (le plus simple)

1. Va sur github.com, bouton vert **New** pour créer un dépôt (par ex. `studio-novalem`).
2. Sur la page du dépôt vide, clique **uploading an existing file**.
3. Glisse le contenu de ce dossier (le fichier `index.html`, les dossiers `css`, `js`, `assets` et les autres fichiers). Clique **Commit changes**.
4. Va sur vercel.com, connecte-toi avec GitHub, bouton **Add New > Project**.
5. Choisis le dépôt `studio-novalem`, laisse tout par défaut, clique **Deploy**.
6. Au bout d'une minute tu as une adresse en `.vercel.app`. C'est en ligne.

## Mettre en ligne sur OVH (FileZilla)

Envoie tout le contenu du dossier dans le répertoire `www` de ton hébergement. Le site est à la racine.

## Brancher ton domaine

Sur Vercel : onglet **Settings > Domains**, ajoute `studionovalem.fr`, puis suis les instructions (un enregistrement à créer chez OVH). Le HTTPS est automatique.

## Ce que tu peux changer facilement

- **Textes et prix** : tout est dans `index.html`, en clair.
- **Coordonnées** : cherche `contact@studionovalem.fr` et les numéros de téléphone dans `index.html`, remplace partout.
- **Réalisations** : chaque projet est un bloc `<article class="work">`. Pour l'instant les aperçus sont des maquettes stylées. Quand tu auras des captures d'écran de tes sites, on remplacera le bloc `<div class="mock">` par une vraie `<img>`.
- **Couleurs** : les variables sont en haut de `css/style.css` (`--accent`, `--violet`, `--cyan`, etc.).

## À ajouter plus tard (quand tu voudras)

- Vrais screenshots des réalisations.
- Bloc témoignages (2 ou 3 phrases de vrais clients).
- Nova connectée à une vraie IA (nécessite un petit backend, la clé ne doit jamais être côté client).
- Formulaire relié à un service d'envoi (Formspree) au lieu du `mailto`.
