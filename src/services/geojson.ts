import type { FeatureCollection, Geometry } from 'geojson';
import type { FeatureProperties } from '@/shared/types';

export type GeoFeatureCollection = FeatureCollection<Geometry, FeatureProperties>;

/**
 * Carrega um GeoJSON estático servido a partir de `/public/data`.
 * Lança erro se a resposta não for OK ou o JSON for inválido.
 */
export async function loadGeoJson(url: string, signal?: AbortSignal): Promise<GeoFeatureCollection> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`GeoJSON ${res.status}: ${res.statusText} (${url})`);
  }
  const data = (await res.json()) as GeoFeatureCollection;
  if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error(`GeoJSON inválido em ${url}: esperado FeatureCollection`);
  }
  return data;
}
