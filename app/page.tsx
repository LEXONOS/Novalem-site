import {
  Container,
  Section,
  Eyebrow,
  SplitText,
  MaskReveal,
  MagneticButton,
  MarqueeRow,
  Card,
  CardTitle,
  CardBody,
  Rule,
} from "@/components/ui";
import { DURATION, STAGGER, EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ data */

const COLORS = [
  { name: "porcelaine-000", hex: "#FFFDF9", use: "Fond principal" },
  { name: "porcelaine-100", hex: "#FAF7F1", use: "Fond alterné" },
  { name: "porcelaine-200", hex: "#F1ECE2", use: "Surfaces, cartes" },
  { name: "porcelaine-300", hex: "#E3DCCE", use: "Bordures" },
  { name: "encre-900", hex: "#12100C", use: "Texte principal" },
  { name: "encre-600", hex: "#4A4640", use: "Texte secondaire" },
  { name: "encre-500", hex: "#6D6860", use: "Légendes, eyebrow" },
  { name: "encre-400", hex: "#8A857B", use: "Traits, icônes, gros texte" },
  { name: "or-100", hex: "#F7EDD6", use: "Fonds d'accent" },
  { name: "or-400", hex: "#E8A020", use: "Survols, aplats clairs" },
  { name: "or-500", hex: "#C8900A", use: "Accent principal, aplats" },
  { name: "or-600", hex: "#A67405", use: "Icônes, texte ≥ 24px" },
  { name: "or-700", hex: "#7F5900", use: "Or lisible, toute taille" },
];

const CONTRASTS = [
  { pair: "encre-900 / porcelaine-000", ratio: "18.7", verdict: "AAA" },
  { pair: "encre-600 / porcelaine-000", ratio: "9.2", verdict: "AAA" },
  { pair: "encre-500 / porcelaine-000", ratio: "5.4", verdict: "AA" },
  { pair: "encre-500 / porcelaine-200", ratio: "4.7", verdict: "AA" },
  { pair: "encre-400 / porcelaine-000", ratio: "3.6", verdict: "Gros texte" },
  { pair: "or-700 / porcelaine-000", ratio: "6.2", verdict: "AA" },
  { pair: "or-600 / porcelaine-000", ratio: "4.0", verdict: "Gros texte" },
  { pair: "or-500 / porcelaine-000", ratio: "2.8", verdict: "Aplats seuls" },
  { pair: "encre-900 / or-500", ratio: "6.7", verdict: "AA" },
];

const TYPE_SCALE = [
  { token: "display", cls: "text-display font-display", note: "clamp 52 → 136px · 0.94 · -0.042em" },
  { token: "h1", cls: "text-h1 font-display", note: "clamp 40 → 84px · 0.98 · -0.034em" },
  { token: "h2", cls: "text-h2 font-display", note: "clamp 32 → 56px · 1.02 · -0.026em" },
  { token: "h3", cls: "text-h3 font-display", note: "clamp 24 → 36px · 1.05 · -0.018em" },
  { token: "h4", cls: "text-h4 font-display", note: "clamp 19 → 24px · 1.18 · -0.01em" },
  { token: "lead", cls: "text-lead font-sans text-encre-600", note: "clamp 18 → 22px · 1.55" },
  { token: "body", cls: "text-body font-sans text-encre-600", note: "clamp 16 → 17px · 1.6 · mesure 68ch" },
  { token: "caption", cls: "text-caption font-sans text-encre-500", note: "clamp 13 → 14px · 1.5" },
];

const SPACING = [
  { token: "gutter", value: "clamp(20 → 36px)", use: "Gouttière de grille et marge latérale" },
  { token: "section", value: "clamp(96 → 200px)", use: "Rythme vertical par défaut" },
  { token: "section-sm", value: "clamp(64 → 120px)", use: "Blocs courts, pieds de page" },
  { token: "content", value: "1320px", use: "Largeur max de contenu" },
  { token: "reading", value: "720px", use: "Colonne de lecture" },
  { token: "measure", value: "68ch", use: "Mesure max d'un paragraphe" },
];

/* ------------------------------------------------------------------ page */

export default function DesignSystemPage() {
  return (
    <main id="contenu">
      {/* ---------------------------------------------------------- entête */}
      <Section tone="base" space="section">
        <Container>
          <MaskReveal immediate>
            <Eyebrow marker>Design system · v1</Eyebrow>
          </MaskReveal>

          <SplitText
            as="h1"
            by="chars"
            immediate
            delay={0.15}
            className="mt-10 font-display text-display"
          >
            NOVALEM
          </SplitText>

          <div className="mt-10 max-w-reading">
            <SplitText
              as="p"
              by="lines"
              immediate
              delay={0.35}
              className="measure text-lead text-encre-600"
            >
              Tokens, échelle typographique et primitives. Cette page ne contient
              aucune section de contenu : elle sert uniquement à valider le
              système avant de construire les rubriques.
            </SplitText>
          </div>

          <div className="mt-14">
            <Rule immediate delay={0.5} />
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-5">
            <MagneticButton href="#couleur">Voir les tokens</MagneticButton>
            <MagneticButton href="#primitives" variant="ghost">
              Voir les primitives
            </MagneticButton>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- couleur */}
      <Section tone="alt" space="section" rule id="couleur">
        <Container>
          <MaskReveal>
            <Eyebrow marker>01 · Couleur</Eyebrow>
          </MaskReveal>
          <SplitText as="h2" by="words" className="mt-6 font-display text-h2">
            Porcelaine, encre, or
          </SplitText>

          <div className="mt-16 grid-editorial">
            {COLORS.map((c) => (
              <MaskReveal
                key={c.name}
                className="col-span-6 md:col-span-4 lg:col-span-3"
              >
                <div>
                  <div
                    className="h-24 w-full rounded-xs border border-porcelaine-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="mt-4 text-caption font-medium text-encre-900">
                    {c.name}
                  </p>
                  <p className="mt-1 text-caption text-encre-500">
                    {c.hex} · {c.use}
                  </p>
                </div>
              </MaskReveal>
            ))}
          </div>

          {/* Contrastes */}
          <div className="mt-24 max-w-reading">
            <Eyebrow>Contrastes vérifiés</Eyebrow>
            <dl className="mt-8 divide-y divide-porcelaine-300 border-y border-porcelaine-300">
              {CONTRASTS.map((c) => (
                <div
                  key={c.pair}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="text-body text-encre-600">{c.pair}</dt>
                  <dd className="flex shrink-0 items-baseline gap-4">
                    <span className="text-body tabular-nums text-encre-900">
                      {c.ratio}:1
                    </span>
                    <span className="text-caption uppercase tracking-[0.14em] text-encre-500">
                      {c.verdict}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="measure mt-8 text-caption text-encre-500">
              L&apos;or reste réservé aux aplats, traits et icônes. Pour du
              texte, or-700 est le seul niveau qui tient AA à toute taille,
              or-600 à partir de 24px.
            </p>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ typographie */}
      <Section tone="base" space="section" rule id="typographie">
        <Container>
          <MaskReveal>
            <Eyebrow marker>02 · Typographie</Eyebrow>
          </MaskReveal>
          <SplitText as="h2" by="words" className="mt-6 font-display text-h2">
            Fraunces et Outfit
          </SplitText>

          <div className="mt-20 flex flex-col gap-14">
            {TYPE_SCALE.map((t) => (
              <div key={t.token}>
                <div className="flex items-baseline justify-between gap-6 border-b border-porcelaine-300 pb-3">
                  <span className="text-eyebrow text-encre-500">{t.token}</span>
                  <span className="text-caption text-encre-500">{t.note}</span>
                </div>
                <MaskReveal className="mt-6">
                  <p className={`${t.cls} measure`}>
                    Studio de création de sites internet
                  </p>
                </MaskReveal>
              </div>
            ))}

            <div>
              <div className="flex items-baseline justify-between gap-6 border-b border-porcelaine-300 pb-3">
                <span className="text-eyebrow text-encre-500">eyebrow</span>
                <span className="text-caption text-encre-500">
                  12px · 0.18em · encre-500
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-10">
                <Eyebrow>Sans marqueur</Eyebrow>
                <Eyebrow marker>Avec marqueur</Eyebrow>
                <Eyebrow tone="or" marker>
                  Ton or
                </Eyebrow>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- grille et espace */}
      <Section tone="surface" space="section" rule id="grille">
        <Container>
          <MaskReveal>
            <Eyebrow marker>03 · Grille et espacement</Eyebrow>
          </MaskReveal>
          <SplitText as="h2" by="words" className="mt-6 font-display text-h2">
            Douze colonnes, beaucoup de vide
          </SplitText>

          <div className="mt-16 grid-editorial" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="col-span-1 h-32 rounded-xs border border-dashed border-or-500/40 bg-or-100/60"
              />
            ))}
          </div>

          <dl className="mt-20 grid-editorial">
            {SPACING.map((s) => (
              <div key={s.token} className="col-span-12 md:col-span-6 lg:col-span-4">
                <dt className="text-h4 font-display text-encre-900">{s.token}</dt>
                <dd className="mt-2 text-caption text-encre-500">{s.value}</dd>
                <dd className="mt-1 text-body text-encre-600">{s.use}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- motion */}
      <Section tone="base" space="section" rule id="motion">
        <Container>
          <MaskReveal>
            <Eyebrow marker>04 · Motion</Eyebrow>
          </MaskReveal>
          <SplitText as="h2" by="words" className="mt-6 font-display text-h2">
            Tout monte du bas, sous masque
          </SplitText>

          <div className="mt-16 grid-editorial">
            <Card className="col-span-12 md:col-span-4">
              <CardTitle>Easings</CardTitle>
              <ul className="mt-5 flex flex-col gap-2 text-body text-encre-600">
                <li>expoOut [{EASE.expoOut.join(", ")}]</li>
                <li>power4Out [{EASE.power4Out.join(", ")}]</li>
                <li>silk [{EASE.silk.join(", ")}]</li>
              </ul>
            </Card>
            <Card className="col-span-12 md:col-span-4">
              <CardTitle>Durées</CardTitle>
              <ul className="mt-5 flex flex-col gap-2 text-body text-encre-600">
                {Object.entries(DURATION).map(([k, v]) => (
                  <li key={k}>
                    {k} · {v}s
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="col-span-12 md:col-span-4">
              <CardTitle>Stagger</CardTitle>
              <ul className="mt-5 flex flex-col gap-2 text-body text-encre-600">
                {Object.entries(STAGGER).map(([k, v]) => (
                  <li key={k}>
                    {k} · {v}s
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ primitives */}
      <Section tone="alt" space="section" rule id="primitives">
        <Container>
          <MaskReveal>
            <Eyebrow marker>05 · Primitives</Eyebrow>
          </MaskReveal>
          <SplitText as="h2" by="words" className="mt-6 font-display text-h2">
            Les briques du site
          </SplitText>

          {/* SplitText */}
          <div className="mt-24">
            <Eyebrow>SplitText</Eyebrow>
            <div className="mt-8 flex flex-col gap-10">
              <SplitText as="p" by="chars" className="font-display text-h3">
                Découpe par caractère
              </SplitText>
              <SplitText as="p" by="words" className="font-display text-h3">
                Découpe par mot
              </SplitText>
              <SplitText as="p" by="lines" className="measure text-lead text-encre-600">
                Découpe par ligne. Les lignes sont recalculées à chaque
                changement de largeur, et chaque ligne monte dans son propre
                masque avec un décalage de stagger.
              </SplitText>
            </div>
          </div>

          {/* MaskReveal + Rule */}
          <div className="mt-24 grid-editorial">
            <div className="col-span-12 lg:col-span-6">
              <Eyebrow>MaskReveal</Eyebrow>
              <MaskReveal className="mt-8">
                <p className="measure text-lead text-encre-600">
                  N&apos;importe quel bloc peut être révélé par masque, y
                  compris un visuel ou une carte.
                </p>
              </MaskReveal>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Eyebrow>Rule</Eyebrow>
              <div className="mt-10 flex flex-col gap-8">
                <Rule />
                <Rule tone="or" delay={0.1} />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-24">
            <Eyebrow>MagneticButton</Eyebrow>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <MagneticButton>Demander un devis</MagneticButton>
              <MagneticButton variant="solid">Voir les projets</MagneticButton>
              <MagneticButton variant="ghost">En savoir plus</MagneticButton>
            </div>
            <p className="measure mt-6 text-caption text-encre-500">
              L&apos;effet magnétique est désactivé au doigt et en mouvement
              réduit. Le remplissage or se déclenche aussi au focus clavier.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-24">
            <Eyebrow>Card</Eyebrow>
            <div className="mt-8 grid-editorial">
              <Card className="col-span-12 md:col-span-4" tone="paper">
                <CardTitle>Statique</CardTitle>
                <CardBody>
                  Bordure porcelaine-300, pas d&apos;ombre. Le défaut pour de
                  l&apos;information.
                </CardBody>
              </Card>
              <Card className="col-span-12 md:col-span-4" interactive>
                <CardTitle>Interactive</CardTitle>
                <CardBody>
                  Élévation très basse et soulèvement d&apos;un pixel au survol.
                  Réservée aux cartes cliquables.
                </CardBody>
              </Card>
              <Card className="col-span-12 md:col-span-4" tone="accent">
                <CardTitle>Accent</CardTitle>
                <CardBody>
                  Fond or-100. Une seule carte accent par grille, sinon
                  l&apos;accent ne veut plus rien dire.
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>

        {/* Marquee : pleine largeur, hors container */}
        <div className="mt-24">
          <Eyebrow className="mx-auto block w-full max-w-content px-gutter">
            MarqueeRow
          </Eyebrow>
          <div className="mt-8 border-y border-porcelaine-300 py-8">
            <MarqueeRow
              aria-label="Prestations NOVALEM"
              items={[
                "Sites vitrines",
                "Référencement",
                "Identité",
                "Développement sur mesure",
                "Suivi",
              ]}
              itemClassName="font-display text-h3 text-encre-900"
            />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ fin */}
      <Section tone="ink" space="compact">
        <Container className="flex flex-col items-start gap-8">
          <Eyebrow tone="invert" marker>
            Prochaine étape
          </Eyebrow>
          <SplitText as="p" by="lines" className="measure text-lead text-porcelaine-300">
            Le système est posé. Les rubriques de contenu arrivent dans les
            prompts suivants, hero en premier.
          </SplitText>
        </Container>
      </Section>
    </main>
  );
}
