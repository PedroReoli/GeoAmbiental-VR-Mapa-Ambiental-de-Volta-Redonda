import { Card, Toggle, Button } from '@/shared/components';
import { LAYERS } from '@/shared/constants';
import { useLayersStore } from './layersStore';
import styles from './LayerPanel.module.css';

export function LayerPanel() {
  const visibility = useLayersStore((s) => s.visibility);
  const toggleLayer = useLayersStore((s) => s.toggleLayer);
  const showAll = useLayersStore((s) => s.showAll);
  const hideAll = useLayersStore((s) => s.hideAll);

  const allVisible = LAYERS.every((l) => visibility[l.id]);
  const noneVisible = LAYERS.every((l) => !visibility[l.id]);

  return (
    <Card
      title="Camadas"
      subtitle="Ative ou desative as camadas do mapa"
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
          return (
            <li key={layer.id} className={styles.item}>
              <Toggle
                checked={visibility[layer.id]}
                onChange={() => toggleLayer(layer.id)}
                label={
                  <span className={styles.labelRow}>
                    <span className={styles.swatch} style={{ backgroundColor: color }} aria-hidden />
                    <span>{layer.label}</span>
                  </span>
                }
                description={layer.description}
                accentColor={color}
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
