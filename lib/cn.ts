type ClassValue = string | false | null | undefined | ClassValue[];

/** Concatène des classes conditionnelles. Pas de dépendance externe. */
export function cn(...parts: ClassValue[]): string {
  return parts
    .flat(Infinity as 1)
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(" ");
}
