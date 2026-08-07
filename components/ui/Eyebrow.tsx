import { cn } from "@/lib/cn";

type Tone = "default" | "or" | "invert";

const TONES: Record<Tone, string> = {
  /** encre-500 : 5.5:1 sur porcelaine-000, AA à cette taille. */
  default: "text-encre-500",
  /** or-700 : 6.2:1, seul or lisible en petit corps. */
  or: "text-or-700",
  /** Sur fond encre-900. */
  invert: "text-porcelaine-300",
};

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Trait or de 24px avant le libellé. */
  marker?: boolean;
  as?: "p" | "span" | "div";
}

export function Eyebrow({
  tone = "default",
  marker = false,
  as = "p",
  className,
  children,
  ...rest
}: EyebrowProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        "text-eyebrow inline-flex items-center gap-3",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {marker && (
        <span
          aria-hidden="true"
          className="inline-block h-px w-6 shrink-0 bg-or-500"
        />
      )}
      {children}
    </Tag>
  );
}

export default Eyebrow;
