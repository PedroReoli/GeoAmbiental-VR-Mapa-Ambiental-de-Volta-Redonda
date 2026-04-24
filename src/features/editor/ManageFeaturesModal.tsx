import { useEffect, useMemo, useState } from 'react';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import { Modal, Button, Badge } from '@/shared/components';
import { GEOMETRY_LABEL, LAYERS, type LayerId } from '@/shared/constants';
import { cx } from '@/shared/utils/classnames';
import { useEditorStore } from './editorStore';
import styles from './ManageFeaturesModal.module.css';

interface FeatureRow {
  feature: Feature<Geometry>;
  id: string;
  name: string;
  category?: string;
  geometryType: string;
  severity?: number;
}

interface LayerGroup {
  layerId: LayerId;
  label: string;
  color: string;
  rows: FeatureRow[];
}

export function ManageFeaturesModal() {
  const open = useEditorStore((s) => s.manageOpen);
  const setManageOpen = useEditorStore((s) => s.setManageOpen);
  const removeFeature = useEditorStore((s) => s.removeFeature);
  // tick forca re-render apos delete (features sao mutaveis fora do React)
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState('');

  const groups = useMemo<LayerGroup[]>(() => {
    if (!open) return [];
    const layerRefs = useEditorStore.getState().layerRefs;
    return LAYERS.map((meta) => {
      const layer = layerRefs.get(meta.id);
      const features = (layer?.getSource()?.getFeatures() ?? []) as Feature<Geometry>[];
      const rows: FeatureRow[] = features.map((f) => {
        const geom = f.getGeometry();
        return {
          feature: f,
          id: String(f.get('id') ?? f.getId() ?? '(sem id)'),
          name: String(f.get('name') ?? '(sem nome)'),
          category: f.get('category') as string | undefined,
          geometryType: geom?.getType() ?? '?',
          severity: f.get('severity') as number | undefined,
        };
      });
      return {
        layerId: meta.id,
        label: meta.label,
        color: `var(${meta.colorVar})`,
        rows,
      };
    });
    // tick incluido pra re-rodar memo apos delete
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tick]);

  // Reset filtro ao fechar
  useEffect(() => {
    if (!open) setFilter('');
  }, [open]);

  function handleDelete(layerId: LayerId, feature: Feature<Geometry>) {
    removeFeature(layerId, feature);
    setTick((t) => t + 1);
  }

  const totalFeatures = groups.reduce((sum, g) => sum + g.rows.length, 0);
  const lowerFilter = filter.trim().toLowerCase();

  return (
    <Modal
      open={open}
      onClose={() => setManageOpen(false)}
      title="Gerenciar features"
      description={
        totalFeatures === 0
          ? 'Nenhuma feature criada ainda.'
          : `${totalFeatures} feature${totalFeatures === 1 ? '' : 's'} no total. Clique no X para remover.`
      }
      size="lg"
      accentColor="var(--color-warning)"
    >
      {totalFeatures > 0 && (
        <div className={styles.filterRow}>
          <input
            type="search"
            className={styles.filterInput}
            placeholder="Filtrar por nome ou categoria..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}

      <div className={styles.groups}>
        {groups.map((group) => {
          const visibleRows = lowerFilter
            ? group.rows.filter((r) =>
                `${r.name} ${r.category ?? ''} ${r.id}`.toLowerCase().includes(lowerFilter),
              )
            : group.rows;

          if (lowerFilter && visibleRows.length === 0) return null;

          return (
            <section key={group.layerId} className={styles.group}>
              <header className={styles.groupHeader}>
                <span
                  className={styles.groupSwatch}
                  style={{ backgroundColor: group.color }}
                  aria-hidden
                />
                <h3 className={styles.groupTitle}>{group.label}</h3>
                <span className={styles.groupCount}>
                  {group.rows.length} {group.rows.length === 1 ? 'item' : 'itens'}
                </span>
              </header>

              {visibleRows.length === 0 ? (
                <p className={styles.empty}>
                  {lowerFilter ? 'Nenhum resultado para o filtro.' : 'Nenhuma feature nesta camada.'}
                </p>
              ) : (
                <ul className={styles.list}>
                  {visibleRows.map((row) => (
                    <li key={row.id} className={styles.row}>
                      <div className={styles.rowMain}>
                        <div className={styles.rowName}>{row.name}</div>
                        <div className={styles.rowMeta}>
                          <Badge tone="neutral">{GEOMETRY_LABEL[row.geometryType as keyof typeof GEOMETRY_LABEL] ?? row.geometryType}</Badge>
                          {row.category && <span className={styles.rowCategory}>{row.category}</span>}
                          {row.severity != null && (
                            <span
                              className={cx(styles.rowSeverity)}
                              data-level={row.severity}
                              title={`Severidade ${row.severity}`}
                            >
                              S{row.severity}
                            </span>
                          )}
                          <code className={styles.rowId}>{row.id}</code>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(group.layerId, row.feature)}
                        aria-label={`Remover ${row.name}`}
                        title="Remover"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
                          <path
                            d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14M10 11v6M14 11v6"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <footer className={styles.modalFooter}>
        <span className={styles.hint}>
          Mudancas precisam ser salvas via "Salvar tudo" no toolbar.
        </span>
        <Button variant="primary" size="sm" onClick={() => setManageOpen(false)}>
          Fechar
        </Button>
      </footer>
    </Modal>
  );
}
