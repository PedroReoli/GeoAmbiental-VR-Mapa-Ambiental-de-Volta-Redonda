import { useEffect } from 'react';
import Draw from 'ol/interaction/Draw';
import { useEditorStore } from './editorStore';

/**
 * Quando ha uma tool de desenho ativa (drawingTool), anexa Draw
 * ao mapa com o tipo de geometria escolhido (Point/LineString/Polygon).
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
  const drawingTool = useEditorStore((s) => s.drawingTool);
  const pendingFeature = useEditorStore((s) => s.pendingFeature);

  useEffect(() => {
    // So adiciona Draw quando esta desenhando E nao ha feature pendente
    // (durante o modal aberto, parar de desenhar pra nao acumular vertices)
    if (!drawingTool || pendingFeature) return;

    const map = useEditorStore.getState().mapInstance;
    const layer = useEditorStore.getState().layerRefs.get(drawingTool.layerId);
    if (!map || !layer) return;

    const source = layer.getSource();
    if (!source) return;

    const draw = new Draw({
      source,
      type: drawingTool.geometryType,
    });

    draw.on('drawend', (evt) => {
      const feature = evt.feature;
      feature.set('__pending', true);
      feature.set('layer', drawingTool.layerId);
      // Abrir modal pedindo metadados
      useEditorStore.getState().setPendingFeature(feature);
    });

    map.addInteraction(draw);
    map.getTargetElement().style.cursor = 'crosshair';

    return () => {
      map.removeInteraction(draw);
      map.getTargetElement().style.cursor = '';
    };
  }, [drawingTool, pendingFeature]);
}
