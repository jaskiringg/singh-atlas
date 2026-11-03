type ParsedMetric = {
  num: number | null;
  prefix: string;
  suffix: string;
  decimals: number;
  grouped: boolean;
  raw: string;
};

/** Splits "~98,000" / "13,700+" / "90.7%" into prefix + number + suffix so the
 *  count-up animates the number and leaves ~, +, % and decimals intact. */
export function parseMetric(str: string): ParsedMetric {
  const m = String(str).match(/^([^\d]*)(\d[\d,]*)(?:\.(\d+))?(.*)$/);
  if (!m) return { num: null, prefix: "", suffix: "", decimals: 0, grouped: false, raw: str };
  const [, prefix, intPart, frac = "", suffix] = m;
  return {
    num: parseFloat(`${intPart.replace(/,/g, "")}.${frac || "0"}`),
    prefix,
    suffix,
    decimals: frac.length,
    grouped: intPart.includes(","),
    raw: str,
  };
}

export function formatMetric(n: number, t: ParsedMetric) {
  const digits = t.grouped
    ? n.toLocaleString("en-US", { minimumFractionDigits: t.decimals, maximumFractionDigits: t.decimals })
    : n.toFixed(t.decimals);
  return `${t.prefix}${digits}${t.suffix}`;
}

/** What a metric shows before the count-up starts (and if it never does). */
export function metricPlaceholder(str: string) {
  const t = parseMetric(str);
  return t.num === null ? t.raw : formatMetric(0, t);
}
