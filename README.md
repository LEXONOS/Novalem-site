# NOVALEM — Design system

Base du site vitrine. Next.js 15 en export statique, Tailwind v4, GSAP + ScrollTrigger, Lenis, TypeScript strict.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # génère /out, prêt pour FileZilla / OVH
```

React Three Fiber n'est pas installé : il arrivera avec le hero.

---

## Où vivent les tokens

Tout est déclaré dans `app/globals.css`, bloc `@theme`. Tailwind v4 en dérive automatiquement les utilitaires. Les échelles par défaut de Tailwind sont remises à zéro (`--color-*: initial`, `--text-*: initial`) : impossible d'écrire `text-sm` ou `bg-slate-500` par accident.

Le motion vit dans `lib/motion.ts`. Les mêmes courbes existent en CSS (`--ease-*`) pour les transitions de survol. Une seule source de vérité, deux sorties.

---

## Couleur

| Token | Utilisation |
|---|---|
| `porcelaine-000` | Fond de page. Le défaut. |
| `porcelaine-100` | Fond de section alternée, pour marquer un changement de rythme. Jamais deux sections `100` de suite. |
| `porcelaine-200` | Surfaces posées sur un fond : cartes, encarts, champs. |
| `porcelaine-300` | Bordures et filets uniquement. Jamais un fond, jamais un texte. |
| `encre-900` | Texte principal, titres. |
| `encre-600` | Texte secondaire, paragraphes de corps. |
| `encre-500` | Légendes, eyebrow, métadonnées. |
| `encre-400` | Décoratif : traits, icônes, chiffres de grande taille. Pas de texte courant. |
| `or-100` | Fond d'accent très léger. Un bloc par page. |
| `or-400` | Survols et aplats clairs. |
| `or-500` | Accent principal : aplats, traits, remplissage de bouton. |
| `or-600` | Icônes et texte à partir de 24px. |
| `or-700` | Le seul or lisible en petit corps : liens, labels. |

### Deux corrections par rapport au brief

Ta palette d'origine ne tenait pas AA sur deux points. J'ai gardé tes valeurs et ajouté deux niveaux au lieu de les modifier, pour ne rien casser côté charte.

**`encre-400` (#8A857B) plafonne à 3.6:1 sur porcelaine-000.** Ça passe pour du gros texte, pas pour une légende ni pour un eyebrow en 12px, qui demandent 4.5:1. J'ai ajouté **`encre-500` #6D6860** (5.4:1 sur porcelaine-000, 4.7:1 sur porcelaine-200), qui devient la couleur des légendes et de l'eyebrow. `encre-400` reste dans le système pour les traits, les icônes et les très gros chiffres.

**`or-500` (#C8900A) est à 2.8:1 sur porcelaine-000.** Ça échoue même au seuil du gros texte (3:1) et à celui des icônes. J'ai ajouté **`or-600` #A67405** (4.0:1, gros texte et icônes) et **`or-700` #7F5900** (6.2:1, texte à toute taille). `or-500` reste l'or de marque pour les aplats, les traits et les remplissages, où le contraste texte ne s'applique pas.

Conséquence sur les boutons : un bouton rempli en `or-500` porte du texte `encre-900`, pas du blanc. Blanc sur or-500 donne 2.8:1, encre-900 sur or-500 donne 6.7:1.

Tous les ratios de la matrice sont affichés sur la page de démonstration, section 01.

---

## Typographie

Fraunces en variable font pour le titrage (`font-display`), Outfit pour le texte et l'interface (`font-sans`). Les deux passent par `next/font/google` : aucun appel réseau externe, aucun layout shift, la police de secours est calibrée automatiquement.

Fraunces est chargée avec les axes `SOFT`, `WONK` et `opsz`. Le réglage par défaut est `"SOFT" 0, "WONK" 1` : traits nets, formes un peu penchées, ce qui donne son caractère au titrage sans partir dans le fantaisiste. Si `next/font` refuse un axe sur ta version de Next, retire-le du tableau dans `app/layout.tsx`, rien d'autre ne bouge.

Huit niveaux, tous en `clamp()` :

| Token | Emploi |
|---|---|
| `text-display` | Un seul par page. Le hero. |
| `text-h1` | Titre de page. |
| `text-h2` | Titre de section. |
| `text-h3` | Sous-section, titre de carte importante. |
| `text-h4` | Titre de carte, libellé fort. |
| `text-lead` | Chapô sous un titre. Un par section maximum. |
| `text-body` | Corps de texte. |
| `text-caption` | Légendes, notes, métadonnées. |

Le corps de texte porte `.measure` (68 caractères max). Un paragraphe qui dépasse cette largeur n'est plus lisible, quelle que soit la taille de l'écran.

L'eyebrow est une utilitaire à part (`text-eyebrow`), consommée par `<Eyebrow>` : 12px, capitales, 0.18em de letter-spacing, `encre-500`. Elle se place au-dessus de chaque titre de section et dit ce qu'on regarde, pas ce que le titre dit déjà.

---

## Grille et espacement

Base 4px : `p-4` = 16px, `mt-13` = 52px.

- `.grid-editorial` : 12 colonnes, gouttière fluide. À poser sur un `<Container>` ou via `grid`.
- `max-w-content` : 1320px, largeur max de contenu.
- `max-w-reading` : 720px, colonne de lecture.
- `px-gutter` : marge latérale fluide, 20 à 36px. Appliquée par `<Container>`.
- `py-section` : 96 à 200px. Le rythme par défaut, porté par `<Section>`.
- `py-section-sm` : 64 à 120px, pour les blocs courts et le pied de page.

L'aération est le parti pris. En cas de doute sur un écart, prends le plus grand.

---

## Motion

### Courbes

| Ease | Emploi |
|---|---|
| `expoOut` [0.16, 1, 0.3, 1] | Défaut. Toutes les révélations au scroll. |
| `power4Out` [0.165, 0.84, 0.44, 1] | Micro-interactions, survols, retours d'état. |
| `silk` [0.65, 0.05, 0, 1] | Grands mouvements : traits qui se déploient, transitions de page. |

Les courbes sont converties en fonctions d'easing par `bezierEase()` dans `lib/motion.ts`. GSAP accepte une fonction comme `ease`, donc pas besoin du plugin CustomEase, et les mêmes valeurs servent en CSS via `--ease-*`.

### Durées et stagger

`instant` 0.15 · `fast` 0.3 · `base` 0.6 · `slow` 1.0 · `cinematic` 1.6

`clampDuration()` plafonne tout à 1.6s. Aucune animation ne peut dépasser, même par erreur de calcul.

Stagger : `tight` 0.04 pour les caractères, `base` 0.08 pour les mots, `loose` 0.14 pour les lignes et les cartes.

### Règles

Tout ce qui entre à l'écran monte depuis le bas, dans un masque `overflow: hidden`. Jamais d'opacity nue. `fadeUp` existe pour les cas où le masque n'a pas de sens, et il déplace toujours l'élément en même temps.

Transform et opacity uniquement. Aucun `height`, `top` ou `width` animé.

`prefers-reduced-motion` coupe tout : Lenis est détruit et le scroll natif reprend, SplitText rend le texte tel quel, le marquee devient une bande défilable au doigt, le magnétisme est désactivé.

---

## Primitives

| Composant | Notes |
|---|---|
| `<Container>` | Largeur et gouttières. `width="content" \| "reading" \| "full"`, `grid` pour la grille 12 colonnes. |
| `<Section>` | Rythme vertical et fond. `tone="base" \| "alt" \| "surface" \| "accent" \| "ink"`, `space="section" \| "compact" \| "none"`. |
| `<Eyebrow>` | Petites capitales au-dessus d'un titre. `marker` ajoute le trait or. |
| `<SplitText>` | Découpe en `lines`, `words` ou `chars` et révèle au scroll. N'accepte que du texte brut, pas de JSX. |
| `<MaskReveal>` | Révélation par masque de n'importe quel bloc. `stagger` anime les enfants directs un par un. |
| `<MagneticButton>` | Suit légèrement le curseur, remplissage or qui monte du bas. `variant="outline" \| "solid" \| "ghost"`, `href` pour un lien. |
| `<MarqueeRow>` | Défilement infini, arrêt au survol et au focus. La copie est `aria-hidden`. |
| `<Card>` | Bordure `porcelaine-300`. `interactive` ajoute l'élévation, à réserver aux cartes cliquables. |
| `<Rule>` | Trait qui se déploie en `scaleX` depuis la gauche. |
| `<NoiseOverlay>` | Grain global, posé une fois dans le layout. Opacité 0.035, réglable via `--noise-opacity`. |

### SplitText en détail

La découpe se fait après le premier paint, dans un `useLayoutEffect`, donc jamais de flash de texte non animé. Les mots sont enveloppés dans des spans `inline-block` séparés par de vrais nœuds espace : le retour à la ligne du navigateur est identique avant et après découpe, donc zéro layout shift.

Les masques portent `padding-bottom: var(--split-bleed)` et une marge négative égale, sinon `overflow: hidden` rogne les jambages des g, j, p et y. Si tu vois une lettre coupée sur un niveau typographique, augmente `--split-bleed` dans `globals.css`.

Le regroupement en lignes dépend de la largeur : il est recalculé au redimensionnement, uniquement quand la largeur change (pour ignorer l'apparition de la barre d'adresse mobile).

Accessibilité : le texte complet est exposé via `aria-label` sur l'élément hôte, les fragments générés ne sont pas lus lettre par lettre.

---

## Accessibilité et performance

Lenis ne casse ni les ancres ni le clavier, parce que `SmoothScroll` traite les trois cas qui posent problème :

1. Les liens `#ancre` sont interceptés et confiés à `lenis.scrollTo`, puis le focus est déplacé sur la cible. Sans ça, une ancre déplace la vue mais pas le clavier.
2. Un élément qui reçoit le focus hors écran (navigation au Tab) est ramené immédiatement par `lenis.scrollTo`.
3. En `prefers-reduced-motion`, Lenis est détruit et `scroll-behavior: smooth` reprend nativement.

Le focus est visible partout : contour `or-700` de 2px avec 3px de décalage. Il n'est jamais supprimé.

Un lien d'évitement est posé en tête de layout.

Pour tenir Lighthouse au-dessus de 90 sur mobile : pas d'image dans le système, les polices passent par `next/font`, le grain est un SVG inline en data URI, et GSAP est le seul paquet lourd. Vérifie le score après l'ajout du hero R3F, c'est là que ça se jouera.
