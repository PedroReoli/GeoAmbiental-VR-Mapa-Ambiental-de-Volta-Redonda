/**
 * Constantes globais do projeto.
 * Tudo agnóstico de feature mora aqui.
 */

// --- Volta Redonda / RJ ---
export const VOLTA_REDONDA = {
  name: 'Volta Redonda',
  state: 'RJ',
  ibgeCode: import.meta.env.VITE_IBGE_VR_CODE ?? '3306305',
  // [longitude, latitude] — padrão GeoJSON / OpenLayers EPSG:4326
  center: [-44.0966, -22.5202] as [number, number],
} as const;

// --- Mapa ---
export const MAP_CONFIG = {
  defaultZoom: 13,
  minZoom: 10,
  maxZoom: 19,
  // EPSG:3857 (Web Mercator) — projeção dos tiles OSM
  projection: 'EPSG:3857',
  // EPSG:4326 — projeção dos GeoJSONs (lat/lng)
  dataProjection: 'EPSG:4326',
} as const;

// --- Identificadores das camadas ---
export const LAYER_IDS = {
  GREEN_AREAS: 'green-areas',
  WATER: 'water',
  IMPACT: 'impact',
  POI: 'poi',
} as const;

export type LayerId = (typeof LAYER_IDS)[keyof typeof LAYER_IDS];

// --- Metadados das camadas (label, descrição, fonte de dados, cor) ---
export interface LayerMeta {
  id: LayerId;
  label: string;
  description: string;
  dataUrl: string;
  // Referência ao token CSS de cor (usado em legenda + estilos OL)
  colorVar: string;
  fillVar: string;
}

export const LAYERS: readonly LayerMeta[] = [
  {
    id: LAYER_IDS.GREEN_AREAS,
    label: 'Áreas Verdes',
    description: 'Parques, praças e áreas de preservação',
    dataUrl: '/data/green-areas.geojson',
    colorVar: '--layer-color-green-areas',
    fillVar: '--layer-color-green-areas-fill',
  },
  {
    id: LAYER_IDS.WATER,
    label: 'Rios e Corpos D’Água',
    description: 'Hidrografia urbana',
    dataUrl: '/data/water.geojson',
    colorVar: '--layer-color-water',
    fillVar: '--layer-color-water-fill',
  },
  {
    id: LAYER_IDS.IMPACT,
    label: 'Impacto Ambiental',
    description: 'Pontos de impacto ambiental (simulado)',
    dataUrl: '/data/impact.geojson',
    colorVar: '--layer-color-impact',
    fillVar: '--layer-color-impact-fill',
  },
  {
    id: LAYER_IDS.POI,
    label: 'Pontos de Interesse',
    description: 'Locais de relevância urbana',
    dataUrl: '/data/poi.geojson',
    colorVar: '--layer-color-poi',
    fillVar: '--layer-color-poi-fill',
  },
] as const;

// --- IBGE ---
export const IBGE = {
  baseUrl: import.meta.env.VITE_IBGE_API_URL ?? 'https://servicodados.ibge.gov.br/api/v1',
} as const;

// --- App metadata ---
export const APP = {
  name: 'GeoAmbiental VR',
  shortName: 'GeoVR',
  tagline: 'Mapa Ambiental de Volta Redonda',
  author: 'Pedro Reoli',
  portfolioUrl: 'https://pedroreis.vercel.app/',
  repo: 'https://github.com/',
} as const;
