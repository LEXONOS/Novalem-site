import { cn } from "@/lib/cn";

type Tone = "base" | "alt" | "surface" | "accent" | "ink";
type Space = "section" | "compact" | "none";

const TONES: Record<Tone, string> = {
  /** Fond principal. */
  base: "bg-porcelaine-000 text-encre-900",
  /** Fond alterné, pour marquer un changement de rythme. */
  alt: "bg-porcelaine-100 text-encre-900",
  /** Surface, à utiliser pour les blocs qui portent des cartes. */
  surface: "bg-porcelaine-200 text-encre-900",
  /** Accent très léger. Réservé aux blocs courts, jamais deux de suite. */
  accent: "bg-or-100 text-encre-900",
  /** Inversion. Un seul bloc encre par page, sinon l'effet s'annule. */
  ink: "bg-encre-900 text-porcelaine-000",
};

const SPACES: Record<Space, string> = {
  section: "py-section",
  compact: "py-section-sm",
  none: "py-0",
};

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  space?: Space;
  /** Trait fin porcelaine-300 en haut de la section. */
  rule?: boolean;
}

export function Section({
  tone = "base",
  space = "section",
  rule = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "relative w-full",
        TONES[tone],
        SPACES[space],
        rule && "border-t border-porcelaine-300",
        tone === "ink" && "[--rule-color:var(--color-encre-600)]",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export default Section;
