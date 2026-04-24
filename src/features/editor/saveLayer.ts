import GeoJSON from 'ol/format/GeoJSON';
import type VectorSource from 'ol/source/Vector';
import { MAP_CONFIG, type LayerId } from '@/shared/constants';

interface SaveLayerResponse {
  ok: true;
  layerId: LayerId;
  bytes: number;
}

interface SaveLayerError {
  error: string;
}

/**
 * Serializa uma VectorSource para GeoJSON (re-projetado para EPSG:4326)
 * e envia ao endpoint dev /api/dev/save-layer, que escreve em
 * public/data/<layerId>.geojson.
 *
 * Endpoint so existe em `vite dev` (configurado em vite.config.ts via
 * `apply: 'serve'`). Em build de producao a chamada falha com 404.
 */
export async function saveLayer(layerId: LayerId, source: VectorSource): Promise<SaveLayerResponse> {
  const format = new GeoJSON({
    dataProjection: MAP_CONFIG.dataProjection,
    featureProjection: MAP_CONFIG.projection,
  });

  const features = source.getFeatures();
  const featureCollection = JSON.parse(
    format.writeFeatures(features, { decimals: 6 }),
  ) as {
    type: 'FeatureCollection';
    features: unknown[];
  };

  // Limpa propriedade interna usada pelo highlight de selecao.
  for (const f of featureCollection.features as Array<{ properties?: Record<string, unknown> }>) {
    if (f.properties && '__selected' in f.properties) {
      delete f.properties.__selected;
    }
  }

  const res = await fetch('/api/dev/save-layer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layerId, featureCollection }),
  });

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as SaveLayerError;
      if (body.error) detail = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(`Falha ao salvar camada ${layerId}: ${detail}`);
  }

  return (await res.json()) as SaveLayerResponse;
}
