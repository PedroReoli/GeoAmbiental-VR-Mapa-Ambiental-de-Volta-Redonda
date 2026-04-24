import { Card, Toggle, Button } from '@/shared/components';
import { LAYERS } from '@/shared/constants';
import { useLayersStore } from './layersStore';
import styles from './LayerPanel.module.css';

export function LayerPanel() {
  const visibility = useLayersStore((s) => s.visibility);
  const toggleLayer = useLayersStore((s) => s.toggleLayer);
  const showAll = useLayersStore((s) => s.showAll);
  const hideAll = useLayersStore((s) => s.hideAll);

  const activeCount = LAYERS.filter((l) => visibility[l.id]).length;
  const allVisible = activeCount === LAYERS.length;
  const noneVisible = activeCount === 0;

  return (
    <Card
      title="Camadas"
      subtitle={`${activeCount} de ${LAYERS.length} ativas`}
      padded={false}
      actions={
        <div className={styles.actions}>
          <Button size="sm" variant="ghost" onClick={showAll} disabled={allVisible}>
            Tudo
          </Button>
          <Button size="sm" variant="ghost" onClick={hideAll} disabled={noneVisible}>
            Nada
          </Button>
        </div>
      }
    >
      <ul className={styles.list}>
        {LAYERS.map((layer) => {
          const color = `var(${layer.colorVar})`;
          const fill = `var(${layer.fillVar})`;
          const active = visibility[layer.id];
          return (
            <li
              key={layer.id}
              className={styles.item}
              data-active={active}
              style={{ '--row-accent': color, '--row-accent-fill': fill } as React.CSSProperties}
            >
              <Toggle
                checked={active}
                onChange={() => toggleLayer(layer.id)}
                accentColor={color}
                label={
                  <span className={styles.labelRow}>
                    <span className={styles.swatch} style={{ backgroundColor: color }} aria-hidden />
                    <span className={styles.labelText}>{layer.label}</span>
                  </span>
                }
                description={layer.description}
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
