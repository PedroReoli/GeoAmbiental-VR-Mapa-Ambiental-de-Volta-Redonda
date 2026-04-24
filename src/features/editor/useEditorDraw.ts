import { useEffect } from 'react';
import Draw from 'ol/interaction/Draw';
import { LAYERS } from '@/shared/constants';
import { useEditorStore } from './editorStore';

/**
 * Quando ha uma camada de desenho ativa (drawingLayer), anexa Draw
 * ao mapa com o tipo de geometria correto (Point/LineString/Polygon).
 *
 * Workflow para o usuario:
 *   - Point: clique unico cria a feature
 *   - LineString: cliques adicionam vertices, dblclick fecha a linha
 *   - Polygon: cliques adicionam vertices, fechamento automatico
 *
 * Ao terminar (drawend), a feature ja esta na source. Marcamos como
 * pendente e abrimos o modal de metadados.
 */
export function useEditorDraw(): void {
  const drawingLayer = useEditorStore((s) => s.drawingLayer);
  const pendingFeature = useEditorStore((s) => s.pendingFeature);

  useEffect(() => {
    // So adiciona Draw quando esta desenhando E nao ha feature pendente
    // (durante o modal aberto, parar de desenhar pra nao acumular vertices)
    if (!drawingLayer || pendingFeature) return;

    const map = useEditorStore.getState().mapInstance;
    const layer = useEditorStore.getState().layerRefs.get(drawingLayer);
    if (!map || !layer) return;

    const source = layer.getSource();
    if (!source) return;

    const meta = LAYERS.find((l) => l.id === drawingLayer);
    if (!meta) return;

    const draw = new Draw({
      source,
      type: meta.geometryType,
    });

    draw.on('drawend', (evt) => {
      const feature = evt.feature;
      feature.set('__pending', true);
      feature.set('layer', drawingLayer);
      // Abrir modal pedindo metadados
      useEditorStore.getState().setPendingFeature(feature);
    });

    map.addInteraction(draw);
    map.getTargetElement().style.cursor = 'crosshair';

    return () => {
      map.removeInteraction(draw);
      map.getTargetElement().style.cursor = '';
    };
  }, [drawingLayer, pendingFeature]);
}
