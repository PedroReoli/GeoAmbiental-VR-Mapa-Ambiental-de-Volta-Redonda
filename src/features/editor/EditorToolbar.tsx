import { useEffect, useState } from 'react';
import { Button, Spinner, Badge } from '@/shared/components';
import { LAYERS, type LayerId } from '@/shared/constants';
import { cx } from '@/shared/utils/classnames';
import { useEditorStore } from './editorStore';
import { useEditorDraw } from './useEditorDraw';
import { saveLayer } from './saveLayer';
import { FeatureMetaModal } from './FeatureMetaModal';
import styles from './EditorToolbar.module.css';

export function EditorToolbar() {
  // Anexa Draw quando drawingLayer != null
  useEditorDraw();

  const open = useEditorStore((s) => s.open);
  const drawingLayer = useEditorStore((s) => s.drawingLayer);
  const dirty = useEditorStore((s) => s.dirty);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const saveError = useEditorStore((s) => s.saveError);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const startDrawing = useEditorStore((s) => s.startDrawing);
  const cancelDrawing = useEditorStore((s) => s.cancelDrawing);
  const clearDirty = useEditorStore((s) => s.clearDirty);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);

  const [savedAgo, setSavedAgo] = useState<string | null>(null);
  useEffect(() => {
    if (!lastSavedAt) {
      setSavedAgo(null);
      return;
    }
    setSavedAgo('agora');
    const t = setInterval(() => {
      const s = Math.round((Date.now() - lastSavedAt) / 1000);
      if (s < 60) setSavedAgo(`ha ${s}s`);
      else setSavedAgo(`ha ${Math.round(s / 60)}min`);
    }, 5000);
    return () => clearInterval(t);
  }, [lastSavedAt]);

  async function handleSave() {
    const layerRefs = useEditorStore.getState().layerRefs;
    const dirtyLayers = [...useEditorStore.getState().dirty];
    if (dirtyLayers.length === 0) return;

    setSaveStatus('saving');
    try {
      for (const id of dirtyLayers) {
        const layer = layerRefs.get(id);
        const source = layer?.getSource();
        if (!source) continue;
        await saveLayer(id, source);
        clearDirty(id);
      }
      setSaveStatus('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSaveStatus('error', msg);
    }
  }

  if (!open) {
    return <FeatureMetaModal />;
  }

  return (
    <>
      <div className={styles.toolbar} role="toolbar" aria-label="Editor de camadas">
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Adicionar</span>
          <div className={styles.layerButtons}>
            {LAYERS.map((layer) => (
              <LayerButton
                key={layer.id}
                id={layer.id}
                active={drawingLayer === layer.id}
                onClick={() => startDrawing(layer.id)}
              />
            ))}
          </div>
        </div>

        {drawingLayer && (
          <>
            <div className={styles.divider} aria-hidden />
            <div className={styles.drawingHint}>
              <span className={styles.dot} aria-hidden />
              <DrawingInstruction />
              <Button size="sm" variant="ghost" onClick={cancelDrawing}>
                Cancelar
              </Button>
            </div>
          </>
        )}

        <div className={styles.spacer} />

        <div className={styles.saveSection}>
          {dirty.size > 0 && (
            <Badge tone="warning">{dirty.size} {dirty.size === 1 ? 'pendente' : 'pendentes'}</Badge>
          )}
          {saveStatus === 'success' && savedAgo && (
            <span className={styles.savedMsg}>Salvo {savedAgo}</span>
          )}
          {saveStatus === 'error' && (
            <span className={styles.errorMsg} title={saveError ?? undefined}>
              Erro ao salvar
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={dirty.size === 0 || saveStatus === 'saving'}
            iconLeft={saveStatus === 'saving' ? <Spinner size="sm" /> : null}
          >
            {saveStatus === 'saving' ? 'Salvando...' : 'Salvar tudo'}
          </Button>
        </div>
      </div>
      <FeatureMetaModal />
    </>
  );
}

function LayerButton({
  id,
  active,
  onClick,
}: {
  id: LayerId;
  active: boolean;
  onClick: () => void;
}) {
  const meta = LAYERS.find((l) => l.id === id);
  if (!meta) return null;
  const color = `var(${meta.colorVar})`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(styles.layerButton, active && styles.layerButtonActive)}
      style={{ '--btn-accent': color } as React.CSSProperties}
      aria-pressed={active}
    >
      <span className={styles.layerSwatch} style={{ backgroundColor: color }} aria-hidden />
      <span className={styles.layerLabel}>{meta.label}</span>
      <span className={styles.layerGeom}>
        {meta.geometryType === 'Polygon' && 'área'}
        {meta.geometryType === 'LineString' && 'linha'}
        {meta.geometryType === 'Point' && 'ponto'}
      </span>
    </button>
  );
}

function DrawingInstruction() {
  const drawingLayer = useEditorStore((s) => s.drawingLayer);
  if (!drawingLayer) return null;
  const meta = LAYERS.find((l) => l.id === drawingLayer);
  if (!meta) return null;

  let text = '';
  if (meta.geometryType === 'Point') {
    text = 'Clique no mapa para posicionar o ponto';
  } else if (meta.geometryType === 'LineString') {
    text = 'Clique para adicionar vertices · dblclick para finalizar';
  } else {
    text = 'Clique para adicionar vertices · dblclick ou clique no inicio para fechar';
  }

  return <span className={styles.instructionText}>{text}</span>;
}
