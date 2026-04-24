import { IBGE, VOLTA_REDONDA } from '@/shared/constants';
import type { IBGEMunicipality, IBGEMunicipalityStats } from '@/shared/types';

/**
 * Cliente fino para a API do IBGE.
 * Documentação: https://servicodados.ibge.gov.br/api/docs
 */

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`IBGE API ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function getMunicipality(
  code = VOLTA_REDONDA.ibgeCode,
  signal?: AbortSignal,
): Promise<IBGEMunicipality> {
  return fetchJson<IBGEMunicipality>(`${IBGE.baseUrl}/localidades/municipios/${code}`, signal);
}

interface AggregateValue {
  V: string | null;
  D2N?: string;
}

type AggregateResponse = Array<{
  resultados: Array<{
    series: Array<{
      serie: Record<string, string | null>;
    }>;
  }>;
}>;

/**
 * Busca uma agregação numérica do IBGE (população, área, densidade etc).
 * `aggregate` é o ID da pesquisa, `variable` o ID da variável.
 *
 * Retorna o valor mais recente disponível e o ano de referência.
 */
async function fetchAggregateValue(
  aggregate: number,
  variable: number,
  municipalityCode: string,
  signal?: AbortSignal,
): Promise<AggregateValue> {
  const url = `${IBGE.baseUrl.replace('/v1', '')}/v3/agregados/${aggregate}/periodos/-1/variaveis/${variable}?localidades=N6[${municipalityCode}]`;
  const data = await fetchJson<AggregateResponse>(url, signal);
  const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};
  const years = Object.keys(serie).sort();
  const last = years.at(-1);
  return {
    V: last ? serie[last] : null,
    D2N: last,
  };
}

/**
 * Monta um snapshot estatístico do município consolidando várias chamadas IBGE.
 * Tolera falhas parciais — se uma agregação falhar, o campo vem `undefined`.
 */
export async function getMunicipalityStats(
  code = VOLTA_REDONDA.ibgeCode,
  signal?: AbortSignal,
): Promise<IBGEMunicipalityStats> {
  const munRequest = getMunicipality(code, signal);

  // 6579 = Estimativa populacional / variável 9324 = População residente estimada
  const populationRequest = fetchAggregateValue(6579, 9324, code, signal).catch(() => null);
  // 1301 = Área territorial / variável 615 = Área da unidade territorial (km²)
  const areaRequest = fetchAggregateValue(1301, 615, code, signal).catch(() => null);
  // 1301 / variável 616 = Densidade demográfica
  const densityRequest = fetchAggregateValue(1301, 616, code, signal).catch(() => null);

  const [mun, pop, area, density] = await Promise.all([
    munRequest,
    populationRequest,
    areaRequest,
    densityRequest,
  ]);

  const toNumber = (v: string | null | undefined): number | undefined => {
    if (v == null || v === '' || v === '-') return undefined;
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    id: mun.id,
    name: mun.nome,
    state: mun.microrregiao.mesorregiao.UF.sigla,
    region: mun.microrregiao.mesorregiao.nome,
    population: toNumber(pop?.V),
    area: toNumber(area?.V),
    density: toNumber(density?.V),
    referenceYear: pop?.D2N ? Number(pop.D2N) : undefined,
  };
}
