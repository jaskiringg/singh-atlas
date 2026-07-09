/**
 * Full-bleed editorial quote treatment — no card, no border, just an oversized
 * glyph + large-set first-person text. Used for the standalone anchor moment
 * and as smaller inset "voice breaking through" moments inside existing scenes.
 */
export function PullQuote({
  text,
  size = "lg",
  className,
}: {
  text: string;
  size?: "lg" | "xl";
  className?: string;
}) {
  return (
    <blockquote className={`pull-quote pull-quote--${size}${className ? ` ${className}` : ""}`}>
      <span className="pq-mark" aria-hidden>
        “
      </span>
      <p className="pq-text">{text}</p>
    </blockquote>
  );
}
