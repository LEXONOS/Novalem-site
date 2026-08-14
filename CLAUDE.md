# Studio Novalem — brief de construction du site (à lire par Claude Code)

## But
Construire le site vitrine de Studio Novalem, studio de création de sites internet aux Antilles françaises. Niveau d'exigence : aussi intelligent et soigné que tekiyo.eu. Chaque section est un moment travaillé et animé, jamais un template. Prends le temps, architecture le projet proprement, commence par le hero et descends section par section.

## La marque
- Studio Novalem, dirigé par Louis, 21 ans, étudiant entrepreneur, passionné. Ton fondateur assumé.
- Positionnement : l'exigence des grandes maisons digitales, mais accessible, humaine et locale aux Antilles (Guadeloupe, Martinique, Saint-Martin, Saint-Barthélemy). « Les moins chers mais les meilleurs. »
- Différenciateurs : code natif (pas de WordPress), sites rapides, un seul interlocuteur (celui qui code), site 100 % à vous, SAV à vie.
- Sens du nom : Novalem = Nova (l'étoile, viser la lune) + l'aime (la passion). À glisser dans le storytelling.
- Domaine studionovalem.fr, mail contact@studionovalem.fr, tél +590 690 31 79 99.

## Direction artistique (VALIDÉE — ne pas dévier)
- Clair et lumineux, JAMAIS sombre. Esprit « maison de design » : épuré, éditorial, façon Apple, fonds en verre (glassmorphism léger), subtils dégradés en mouvement.
- Encre #0B0D18 sur fond #F3F5FA. Accent indigo #3D4DFF, avec parcimonie.
- Typo : Bricolage Grotesque (titres, du caractère), Fraunces italique (touches éditoriales), Inter (texte/UI).
- Logo : emblème sceau (cercle fin + étoile nova) + wordmark « Novalem ». SVG dans assets/emblem.svg.
- Beaucoup de blanc, espacements généreux, hiérarchie forte, texte MINIMAL.

## Règles impératives (erreurs déjà commises, à ne pas refaire)
- PAS de curseur custom. On garde la souris normale.
- Le scroll DOIT marcher. Smooth scroll (Lenis) seulement s'il est parfaitement câblé avec ScrollTrigger, sinon scroll natif. Ne JAMAIS bloquer le scroll avec un préchargeur. Une révélation ne doit jamais laisser du contenu caché si le JS échoue (fallback : tout visible).
- Texte minimal partout. Accroches courtes, descriptions minimales, pas de pavés.
- Ordre des sections : Réalisations AVANT les prix.
- Header : toujours du contenu à droite (liens + bouton « Demander un devis ») + menu mobile (burger plein écran).

## Sections (dans cet ordre)
1. Header — emblème + Novalem à gauche ; liens Réalisations, Offre, Méthode, L'atelier ; bouton « Demander un devis » à droite ; burger en mobile. Devient verre au scroll.
2. Hero — riche et fondu. Fond = balise <video> (muette, autoplay, loop, playsinline, poster) OU visuel animé CSS de secours (voir index.html), fondu sur les bords. Par-dessus : eyebrow « Studio web · Antilles françaises », accroche courte (« Le web des Antilles, niveau grande maison. »), une phrase, deux boutons, indicateur de défilement.
3. Marquee — bandeau de mots-clés défilant (Code natif, Sur mesure, Rapide, Référencé, À votre nom).
4. Réalisations — IFC (ifc-guadeloupe.fr) en aperçu live (iframe mis à l'échelle), + place pour d'autres. Peu de texte. Révélation au scroll, survol « Voir ».
5. Offre — 4 formules concises : Essentiel 390 € (livré 7 j) ; Vitrine 790 € recommandé (10-14 j) ; Signature 1 190 € (3 sem) ; Sur mesure. Repère agence 3 000-6 000 €. Compris partout : maquette validée avant code, 2 tours de modifs, SAV à vie, sources livrées. Abonnements 39/149/290 par mois : option compacte, facultative, plus bas.
6. Méthode — 4 étapes (Cadrage, Maquette, Développement, Mise en ligne) + une ligne de progression qui se trace au scroll.
7. L'atelier (présentation de Louis) — ICI le portrait en particules (assets/louis-particles.html, à intégrer et optimiser : perf mobile, repli reduced-motion). Récit court (« Moi c'est Louis, le web est ma passion », le sens de Novalem, un seul interlocuteur) + engagements courts (devis ferme, propriété totale, PageSpeed >90, SAV à vie).
8. Contact — panneau encre, dégradé en fond, accroche courte, boutons mail + tél. Brancher un formulaire FormSubmit vers contact@studionovalem.fr est un plus.
9. Footer — emblème + Novalem, liens, mentions (TVA non applicable, art. 293 B du CGI), « fait aux Antilles ».

## Animations et son (esprit tekiyo, mais fiables)
- Révélations au scroll : titres qui montent sous masque (overflow hidden), éléments qui montent en fondu, cartes en clip-reveal. Easing power4.out / expoOut. Rien de brutal.
- Parallaxe subtile (fond du hero, aperçus de réalisations).
- Boutons magnétiques (le contenu suit légèrement la souris), desktop seulement.
- Marquee en boucle.
- Sons d'interface ORIGINAUX (synthèse Web Audio : survol, clic, révélation, carillon d'entrée) + bouton on/off, démarrage au premier geste utilisateur, coupés si prefers-reduced-motion. (Les sons exacts de tekiyo sont à eux : on recrée dans le même esprit.)
- Préchargeur optionnel, court, NON bloquant, avec sortie forcée de secours.
- prefers-reduced-motion : tout se calme, contenu visible.

## Stack et architecture
- Site statique, déployable simplement (OVH/FileZilla ou Vercel).
- Reco : Vite + TypeScript (ou Astro). GSAP + ScrollTrigger + Lenis bien câblés ensemble.
- Architecture propre : tokens de design centralisés (couleurs, typo, espacements, easings), un module d'animation, un module de son, des composants de section réutilisables. Code lisible et commenté.
- Qualité : responsive mobile d'abord, navigation clavier + focus visible, zéro layout shift, Lighthouse perf >90 sur mobile, HTML sémantique, SEO de base (title, meta, Open Graph, sitemap, Schema.org).

## Contenu (à garder concis)
- Piliers : Code natif (3 à 5x plus rapide, pas de WordPress, pas de faille héritée d'un thème) · Zéro dépendance (domaine, hébergement et sources à votre nom) · SAV gratuit à vie.
- Méthode : Cadrage (30 min au tel, devis ferme sous 48 h) · Maquette (validée avant la moindre ligne de code) · Développement (tests tous écrans, 2 tours de modifs) · Mise en ligne (HTTPS, indexation, remise des sources).
- Engagements : devis ferme · propriété totale · PageSpeed >90 · un seul interlocuteur · délais tenus ou -10 % par semaine · SAV gratuit à vie.

## Livrable
Un site complet, chaque section soignée et animée, prêt à déployer.
