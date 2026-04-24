import type { LayerId } from '../constants';

// --- GeoJSON properties que esperamos nas features das camadas ---
export interface FeatureProperties {
  id: string;
  name: string;
  layer: LayerId;
  description?: string;
  category?: string;
  /** Severidade para camada de impacto ambiental (1 = baixa, 5 = alta) */
  severity?: number;
  [key: string]: unknown;
}

// --- Dado normalizado da feature selecionada (passado pra UI) ---
export interface SelectedFeature {
  id: string;
  name: string;
  layer: LayerId;
  layerLabel: string;
  description?: string;
  category?: string;
  severity?: number;
  /** Coordenadas em [lon, lat] */
  coordinates: [number, number];
  geometryType: string;
}

// --- Resposta da API de municípios do IBGE ---
export interface IBGEMunicipality {
  id: number;
  nome: string;
  microrregiao: {
    nome: string;
    mesorregiao: {
      nome: string;
      UF: {
        nome: string;
        sigla: string;
      };
    };
  };
}

// --- Dados estatísticos consolidados (montados a partir de várias fontes) ---
export interface IBGEMunicipalityStats {
  id: number;
  name: string;
  state: string;
  region: string;
  /** População estimada (último censo ou estimativa) */
  population?: number;
  /** Área territorial em km² */
  area?: number;
  /** Densidade demográfica (hab/km²) */
  density?: number;
  /** Ano de referência dos dados */
  referenceYear?: number;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
