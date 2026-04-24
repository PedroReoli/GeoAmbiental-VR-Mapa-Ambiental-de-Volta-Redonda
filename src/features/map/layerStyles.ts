import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import type { FeatureLike } from 'ol/Feature';
import { LAYER_IDS, type LayerId } from '@/shared/constants';

/** Lê uma CSS variable do :root para alinhar OL ao design system. */
function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

interface StyleSet {
  default: Style;
  selected: Style;
}

const cache = new Map<LayerId, StyleSet>();

function buildPointStyle(stroke: string, fill: string, radius = 7): Style {
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: fill }),
      stroke: new Stroke({ color: stroke, width: 2 }),
    }),
  });
}

function buildLineStyle(stroke: string, width = 3): Style {
  return new Style({
    stroke: new Stroke({ color: stroke, width, lineCap: 'round', lineJoin: 'round' }),
  });
}

function buildPolygonStyle(stroke: string, fill: string, width = 2): Style {
  return new Style({
    stroke: new Stroke({ color: stroke, width }),
    fill: new Fill({ color: fill }),
  });
}

/**
 * Estilo "misto" — preparado para Point + Polygon + LineString num
 * mesmo Style. OL usa apenas a chave compativel com a geometria de
 * cada feature (image para Point, fill para Polygon, stroke para
 * ambos). Util quando a camada aceita varios tipos (ex: impact).
 */
function buildMixedStyle(stroke: string, fill: string, opts: { pointRadius?: number; width?: number } = {}): Style {
  const { pointRadius = 8, width = 2 } = opts;
  return new Style({
    image: new CircleStyle({
      radius: pointRadius,
      fill: new Fill({ color: fill }),
      stroke: new Stroke({ color: stroke, width: 2 }),
    }),
    fill: new Fill({ color: fill }),
    stroke: new Stroke({ color: stroke, width }),
  });
}

function buildStyleSet(id: LayerId): StyleSet {
  const selectedStroke = cssVar('--layer-color-selected', '#e9c46a');
  const selectedFill = cssVar('--layer-color-selected-fill', 'rgba(233,196,106,0.55)');

  switch (id) {
    case LAYER_IDS.GREEN_AREAS: {
      const stroke = cssVar('--layer-color-green-areas', '#52b788');
      const fill = cssVar('--layer-color-green-areas-fill', 'rgba(82,183,136,0.35)');
      return {
        default: buildPolygonStyle(stroke, fill),
        selected: buildPolygonStyle(selectedStroke, selectedFill, 3),
      };
    }
    case LAYER_IDS.WATER: {
      const stroke = cssVar('--layer-color-water', '#0096c7');
      return {
        default: buildLineStyle(stroke, 3),
        selected: buildLineStyle(selectedStroke, 5),
      };
    }
    case LAYER_IDS.IMPACT: {
      const stroke = cssVar('--layer-color-impact', '#e76f51');
      const fill = cssVar('--layer-color-impact-fill', 'rgba(231,111,81,0.45)');
      // Layer aceita Polygon e Point — estilo misto cobre os dois.
      return {
        default: buildMixedStyle(stroke, fill, { pointRadius: 8, width: 2 }),
        selected: buildMixedStyle(selectedStroke, selectedFill, { pointRadius: 11, width: 3 }),
      };
    }
    case LAYER_IDS.POI: {
      const stroke = cssVar('--layer-color-poi', '#7e6535');
      const fill = cssVar('--layer-color-poi-fill', 'rgba(126,101,53,0.45)');
      return {
        default: buildPointStyle(stroke, fill, 6),
        selected: buildPointStyle(selectedStroke, selectedFill, 10),
      };
    }
  }
}

export function getStyleFor(layerId: LayerId): (feature: FeatureLike) => Style {
  let set = cache.get(layerId);
  if (!set) {
    set = buildStyleSet(layerId);
    cache.set(layerId, set);
  }
  return (feature) => (feature.get('__selected') ? set!.selected : set!.default);
}
