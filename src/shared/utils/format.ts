/** Formata número como inteiro pt-BR (1.234.567). */
export function formatInteger(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('pt-BR').format(value);
}

/** Formata número decimal pt-BR (1.234,56). */
export function formatDecimal(value: number | undefined | null, fractionDigits = 2): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Formata coordenada lat/lon como string com sufixo cardeal. */
export function formatCoordinate(lon: number, lat: number, precision = 5): string {
  const lonAbs = Math.abs(lon).toFixed(precision);
  const latAbs = Math.abs(lat).toFixed(precision);
  const lonDir = lon >= 0 ? 'L' : 'O';
  const latDir = lat >= 0 ? 'N' : 'S';
  return `${latAbs}° ${latDir}, ${lonAbs}° ${lonDir}`;
}
