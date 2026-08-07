import { cn } from "@/lib/cn";

type Width = "content" | "reading" | "full";

const WIDTHS: Record<Width, string> = {
  content: "max-w-content",
  reading: "max-w-reading",
  full: "max-w-none",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: Width;
  /** Applique la grille éditoriale 12 colonnes. */
  grid?: boolean;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
}

export function Container({
  width = "content",
  grid = false,
  as = "div",
  className,
  children,
  ...rest
}: ContainerProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-gutter",
        WIDTHS[width],
        grid && "grid-editorial",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Container;
