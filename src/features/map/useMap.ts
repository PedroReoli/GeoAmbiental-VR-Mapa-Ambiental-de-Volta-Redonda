import { useEffect, useRef } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import type Feature from 'ol/Feature';
import type { Geometry, Point } from 'ol/geom';

import { LAYERS, MAP_CONFIG, VOLTA_REDONDA, type LayerId } from '@/shared/constants';
import { useLayersStore } from '@/features/layers/layersStore';
import { getStyleFor } from './layerStyles';
import type { SelectedFeature } from '@/shared/types';

interface UseMapResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Inicializa o OpenLayers, monta as camadas vetoriais a partir
 * dos GeoJSONs e conecta o store Zustand (visibilidade + seleção).
 */
export function useMap(): UseMapResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<OlMap | null>(null);
  const layerRefs = useRef(new Map<LayerId, VectorLayer<VectorSource>>());
  const selectedFeatureRef = useRef<Feature<Geometry> | null>(null);

  // --- montagem do mapa ---
  useEffect(() => {
    if (!containerRef.current) return;

    const baseLayer = new TileLayer({ source: new OSM() });

    const vectorLayers = LAYERS.map((meta) => {
      const source = new VectorSource({
        url: meta.dataUrl,
        format: new GeoJSON({
          dataProjection: MAP_CONFIG.dataProjection,
          featureProjection: MAP_CONFIG.projection,
        }),
      });
      const layer = new VectorLayer({
        source,
        style: getStyleFor(meta.id),
      });
      layer.set('layerId', meta.id);
      layerRefs.current.set(meta.id, layer);
      return layer;
    });

    const map = new OlMap({
      target: containerRef.current,
      layers: [baseLayer, ...vectorLayers],
      view: new View({
        center: fromLonLat(VOLTA_REDONDA.center),
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
      }),
      controls: defaultControls({ attributionOptions: { collapsible: true } }).extend([
        new ScaleLine({ units: 'metric' }),
      ]),
    });

    const clearSelection = () => {
      const prev = selectedFeatureRef.current;
      if (prev) {
        prev.unset('__selected');
        selectedFeatureRef.current = null;
      }
    };

    const markSelected = (feature: Feature<Geometry>) => {
      clearSelection();
      feature.set('__selected', true);
      selectedFeatureRef.current = feature;
    };

    // --- clique no mapa: detectar feature e atualizar store ---
    map.on('singleclick', (evt) => {
      let hit: { feature: Feature<Geometry>; layerId: LayerId } | null = null;
      map.forEachFeatureAtPixel(
        evt.pixel,
        (feature, layer) => {
          const layerId = layer?.get('layerId') as LayerId | undefined;
          if (!layerId) return false;
          hit = { feature: feature as Feature<Geometry>, layerId };
          return true;
        },
        { hitTolerance: 4 },
      );

      if (hit) {
        const { feature, layerId } = hit as { feature: Feature<Geometry>; layerId: LayerId };
        const props = feature.getProperties();
        const geom = feature.getGeometry();
        if (!geom) return;

        const coord =
          geom.getType() === 'Point'
            ? (geom as Point).getCoordinates()
            : ((): [number, number] => {
                const ext = geom.getExtent();
                return [(ext[0] + ext[2]) / 2, (ext[1] + ext[3]) / 2];
              })();
        const lonLat = toLonLat(coord);

        const meta = LAYERS.find((l) => l.id === layerId);
        const selected: SelectedFeature = {
          id: String(props.id ?? feature.getId() ?? ''),
          name: String(props.name ?? 'Sem nome'),
          layer: layerId,
          layerLabel: meta?.label ?? layerId,
          description: props.description,
          category: props.category,
          severity: props.severity,
          coordinates: [lonLat[0], lonLat[1]],
          geometryType: geom.getType(),
        };

        markSelected(feature);
        useLayersStore.getState().setSelectedFeature(selected);
      } else {
        clearSelection();
        useLayersStore.getState().setSelectedFeature(null);
      }
    });

    // --- cursor pointer em cima de feature ---
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel, { hitTolerance: 4 });
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
      layerRefs.current.clear();
      selectedFeatureRef.current = null;
    };
  }, []);

  // --- sincronizar visibilidade com store ---
  useEffect(() => {
    const apply = (visibility: Record<LayerId, boolean>) => {
      for (const [id, layer] of layerRefs.current.entries()) {
        layer.setVisible(visibility[id] ?? true);
      }
    };
    apply(useLayersStore.getState().visibility);
    const unsub = useLayersStore.subscribe((state) => apply(state.visibility));
    return unsub;
  }, []);

  return { containerRef };
}
