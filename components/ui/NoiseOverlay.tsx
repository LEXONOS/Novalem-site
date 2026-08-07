const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
       <filter id="n">
         <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="4" stitchTiles="stitch"/>
         <feColorMatrix type="saturate" values="0"/>
       </filter>
       <rect width="160" height="160" filter="url(#n)"/>
     </svg>`,
  );

/**
 * Grain fin appliqué à toute la page. Purement décoratif :
 * pointer-events none, aria-hidden, et aucune peinture au scroll
 * (position fixed + will-change absent volontairement).
 */
export function NoiseOverlay({ opacity }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply"
      style={{
        opacity: opacity ?? "var(--noise-opacity)",
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}

export default NoiseOverlay;
