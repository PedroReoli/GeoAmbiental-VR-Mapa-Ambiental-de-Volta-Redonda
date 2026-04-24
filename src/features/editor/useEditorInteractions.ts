import { useEffect } from 'react';
import Translate from 'ol/interaction/Translate';
import Modify from 'ol/interaction/Modify';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import { useEditorStore } from './editorStore';
import type { LayerId } from '@/shared/constants';

/**
 * Quando o modo de edicao esta ativo, anexa interacoes Translate (arrastar
 * feature inteira) e Modify (editar vertices, segurando Alt) a TODAS as
 * VectorLayers registradas. Cada mudanca marca a camada como dirty.
 *
 * Translate usa `layers:` (nao `features:`) para capturar features
 * adicionadas async pelo carregamento do GeoJSON.
 *
 * Limpa as interacoes ao desativar para nao bloquear cliques normais.
 */
export function useEditorInteractions(): void {
  const enabled = useEditorStore((s) => s.enabled);

  useEffect(() => {
    if (!enabled) return;

    const map = useEditorStore.getState().mapInstance;
    const layerRefs = useEditorStore.getState().layerRefs;
    if (!map) return;

    const interactions: Array<Translate | Modify> = [];

    for (const [layerId, layer] of layerRefs.entries()) {
      const source = layer.getSource();
      if (!source) continue;

      const translate = new Translate({ layers: [layer] });
      translate.on('translateend', (evt) => {
        markLayerDirty(layerId, evt.features.getArray() as Feature<Geometry>[]);
      });

      const modify = new Modify({ source });
      modify.on('modifyend', (evt) => {
        markLayerDirty(layerId, evt.features.getArray() as Feature<Geometry>[]);
      });

      map.addInteraction(modify);
      map.addInteraction(translate);
      interactions.push(modify, translate);
    }

    return () => {
      for (const i of interactions) map.removeInteraction(i);
    };
  }, [enabled]);
}

function markLayerDirty(layerId: LayerId, features: Feature<Geometry>[]): void {
  for (const f of features) {
    f.set('__edited', true);
  }
  useEditorStore.getState().markDirty(layerId);
}
