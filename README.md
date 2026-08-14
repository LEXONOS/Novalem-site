# Studio Novalem — site vitrine

Site vitrine de **Studio Novalem**, studio de création de sites internet aux Antilles françaises.
Site statique, animé, sans framework front lourd : **Vite + TypeScript + GSAP/ScrollTrigger + Lenis**.

## Démarrer

```bash
npm install
npm run dev        # serveur local http://localhost:5173
```

## Construire pour la production

```bash
npm run build      # typecheck + build -> dossier dist/
npm run preview    # prévisualise le build
```

Le dossier **`dist/`** contient le site prêt à déployer (fichiers statiques).

## Déployer

- **OVH / FileZilla** : envoyer **le contenu de `dist/`** à la racine de l'hébergement.
- **Vercel** : importer le dépôt, build command `npm run build`, output `dist`.

## Architecture

```
index.html                 Balisage sémantique complet (contenu visible sans JS)
public/assets/             emblem.svg, louis-particles.html (portrait), og-cover.svg
public/robots.txt, sitemap.xml
src/
  main.ts                  Point d'entrée : câble tous les modules
  styles/
    tokens.css             Source unique : couleurs, typo, espacements, easings
    base.css               Reset, primitives partagées, règles reduced-motion
    main.css               Styles de sections
  lib/
    motion.ts              Jetons de mouvement (miroir des --e-* / --d-*)
    scroll.ts              Lenis <-> ScrollTrigger, repli scroll natif
    reveal.ts              Révélations au scroll (+ failsafe anti-contenu-caché)
    magnetic.ts            Boutons magnétiques (desktop, pointeur fin)
    sound.ts               Sons d'interface Web Audio (on/off, 1er geste)
  sections/
    header.ts hero.ts marquee.ts realisations.ts
    methode.ts atelier.ts contact.ts
```

## Principes tenus

- **Le scroll marche toujours.** Lenis n'est activé que hors reduced-motion et reste synchronisé à ScrollTrigger ; sinon scroll natif. Les ancres et la navigation clavier ne sont jamais cassées. Le blocage du menu passe par `lenis.stop()`, jamais par un préchargeur.
- **Aucun contenu caché si le JS échoue.** Le HTML est complet et lisible sans JS ; les révélations sont une amélioration progressive, avec un failsafe qui force l'affichage.
- **`prefers-reduced-motion`** coupe animations et sons, tout reste visible.
- Accessibilité : focus visible (anneau indigo), cibles tactiles ≥ 44 px, HTML sémantique, contraste AA.
- SEO de base : title, meta, Open Graph, JSON-LD (ProfessionalService), sitemap, robots.

## Contenu à personnaliser

- **Vidéo du hero** (optionnelle) : décommenter la balise `<video>` dans `index.html` et déposer `public/assets/hero.mp4` + `hero-poster.jpg`. Par défaut, un fond dégradé animé sert de repli fiable.
- **Réalisations** : ajouter des cartes `.work[data-embed="URL"]` dans la section Réalisations.
- **Formulaire** : la première soumission via FormSubmit demande une confirmation par email à `contact@studionovalem.fr` (activation du service).

Contact : contact@studionovalem.fr · +590 690 31 79 99 · studionovalem.fr
