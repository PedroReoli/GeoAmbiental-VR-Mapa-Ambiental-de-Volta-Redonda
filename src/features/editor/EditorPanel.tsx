import { useEffect, useState } from 'react';
import { Card, Toggle, Button, Spinner, Badge } from '@/shared/components';
import { LAYERS, type LayerId } from '@/shared/constants';
import { useEditorStore } from './editorStore';
import { saveLayer } from './saveLayer';
import { useEditorInteractions } from './useEditorInteractions';
import styles from './EditorPanel.module.css';

export function EditorPanel() {
  // Anexa Translate/Modify ao mapa quando enabled = true
  useEditorInteractions();

  const enabled = useEditorStore((s) => s.enabled);
  const dirty = useEditorStore((s) => s.dirty);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const saveError = useEditorStore((s) => s.saveError);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const toggleEnabled = useEditorStore((s) => s.toggleEnabled);
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

  const dirtyCount = dirty.size;

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

  return (
    <Card
      title="Editor (dev)"
      subtitle={enabled ? 'Arraste features no mapa' : 'Modo edicao desativado'}
      padded={false}
      className={styles.card}
    >
      <div className={styles.toggleRow}>
        <Toggle
          checked={enabled}
          onChange={toggleEnabled}
          label="Modo edicao"
          description="Arraste pontos, linhas ou poligonos"
          accentColor="var(--color-warning)"
        />
      </div>

      {enabled && (
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Pendentes</span>
              <Badge tone={dirtyCount > 0 ? 'warning' : 'neutral'}>
                {dirtyCount}
              </Badge>
            </div>
            {dirtyCount === 0 ? (
              <p className={styles.empty}>Nenhuma alteracao pendente.</p>
            ) : (
              <ul className={styles.dirtyList}>
                {[...dirty].map((id) => (
                  <DirtyRow key={id} id={id} />
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleSave}
              disabled={dirtyCount === 0 || saveStatus === 'saving'}
              iconLeft={saveStatus === 'saving' ? <Spinner size="sm" /> : null}
            >
              {saveStatus === 'saving'
                ? 'Salvando...'
                : `Salvar ${dirtyCount > 0 ? `(${dirtyCount})` : ''}`}
            </Button>
          </div>

          {saveStatus === 'success' && (
            <p className={styles.successMsg}>
              Salvo {savedAgo ? `(${savedAgo})` : ''} em <code>public/data/</code>.
            </p>
          )}
          {saveStatus === 'error' && saveError && (
            <p className={styles.errorMsg}>Erro: {saveError}</p>
          )}

          <details className={styles.help}>
            <summary>Como usar</summary>
            <ol>
              <li>Ative o modo edicao acima</li>
              <li>Arraste qualquer feature no mapa para a posicao correta</li>
              <li>Clique em "Salvar" para persistir em <code>public/data/</code></li>
              <li>Faca commit dos arquivos alterados</li>
            </ol>
            <p className={styles.helpHint}>
              Para mover so um vertice de linha/poligono, segure <kbd>Alt</kbd> e arraste.
            </p>
          </details>
        </div>
      )}
    </Card>
  );
}

function DirtyRow({ id }: { id: LayerId }) {
  const meta = LAYERS.find((l) => l.id === id);
  if (!meta) return null;
  const color = `var(${meta.colorVar})`;
  return (
    <li className={styles.dirtyRow}>
      <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden />
      <span className={styles.dirtyName}>{meta.label}</span>
      <Badge tone="warning">modificada</Badge>
    </li>
  );
}
