import { cn } from "@/lib/cn";

type Tone = "surface" | "paper" | "accent";

const TONES: Record<Tone, string> = {
  /** Défaut. Se pose sur porcelaine-000 ou porcelaine-100. */
  surface: "bg-porcelaine-200",
  /** Pour une carte posée sur porcelaine-200. */
  paper: "bg-porcelaine-000",
  /** Carte mise en avant. Une seule par grille. */
  accent: "bg-or-100",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** Élévation et léger soulèvement au survol. À réserver aux cartes cliquables. */
  interactive?: boolean;
  as?: "div" | "article" | "li" | "figure";
}

export function Card({
  tone = "surface",
  interactive = false,
  as = "div",
  className,
  children,
  ...rest
}: CardProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        "relative rounded-card border border-porcelaine-300",
        "p-7 md:p-9",
        TONES[tone],
        interactive && [
          "shadow-lift will-change-transform",
          "transition-[transform,box-shadow,border-color] duration-fast ease-[var(--ease-power4-out)]",
          "hover:-translate-y-1 hover:border-or-500/40 hover:shadow-lift-hover",
          "focus-within:-translate-y-1 focus-within:shadow-lift-hover",
          "motion-reduce:transform-none motion-reduce:transition-none",
        ],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({
  className,
  children,
  as = "h3",
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" }) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={cn("text-h4 text-encre-900", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardBody({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("measure text-body text-encre-600", className)} {...rest}>
      {children}
    </p>
  );
}

export default Card;
