/** All money is integer pesewas (GHS minor units). No floats touch amounts. */

export function formatGhs(pesewas: number): string {
  const sign = pesewas < 0 ? "-" : "";
  const abs = Math.abs(pesewas);
  const major = Math.trunc(abs / 100).toLocaleString("en-GH");
  const minor = String(abs % 100).padStart(2, "0");
  return `${sign}GHS ${major}.${minor}`;
}

/** "12.5" -> 1250, "-3" -> -300. Returns null for anything that is not a GHS amount with up to 2 decimals. */
export function parseGhsToPesewas(input: string): number | null {
  const value = input.trim().replace(/,/g, "");
  const match = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) return null;
  const pesewas = Number(match[2]) * 100 + Number((match[3] ?? "").padEnd(2, "0"));
  if (!Number.isSafeInteger(pesewas)) return null;
  return match[1] ? -pesewas : pesewas;
}
