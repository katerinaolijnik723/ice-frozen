/** Hermes ships an incomplete Intl - format numbers by hand. */
export function formatNum(value: number): string {
  const n = Math.max(0, Math.round(value));
  const s = String(n);
  if (s.length <= 3) {
    return s;
  }
  let out = '';
  let count = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    out = s[i] + out;
    count++;
    if (count % 3 === 0 && i > 0) {
      out = ',' + out;
    }
  }
  return out;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
