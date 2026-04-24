import { Card, Badge, Button } from '@/shared/components';
import { LAYERS } from '@/shared/constants';
import { useLayersStore } from '@/features/layers/layersStore';
import { formatCoordinate } from '@/shared/utils/format';
import styles from './FeatureCard.module.css';

export function FeatureCard() {
  const selected = useLayersStore((s) => s.selectedFeature);
  const clear = useLayersStore((s) => s.setSelectedFeature);

  if (!selected) {
    return (
      <Card title="Detalhes" subtitle="Clique em um elemento do mapa">
        <p className={styles.empty}>
          Selecione qualquer ponto, área ou linha do mapa para ver as informações detalhadas.
        </p>
      </Card>
    );
  }

  const layerMeta = LAYERS.find((l) => l.id === selected.layer);
  const layerColor = layerMeta ? `var(${layerMeta.colorVar})` : undefined;
  const [lon, lat] = selected.coordinates;

  return (
    <Card
      title={selected.name}
      subtitle={
        <Badge color={layerColor}>{selected.layerLabel}</Badge>
      }
      actions={
        <Button size="sm" variant="ghost" onClick={() => clear(null)} aria-label="Fechar detalhes">
          ×
        </Button>
      }
    >
      <dl className={styles.list}>
        {selected.category && (
          <Row label="Categoria">
            <span>{selected.category}</span>
          </Row>
        )}
        {selected.severity != null && (
          <Row label="Severidade">
            <SeverityBar value={selected.severity} />
          </Row>
        )}
        <Row label="Tipo geométrico">
          <span className={styles.mono}>{selected.geometryType}</span>
        </Row>
        <Row label="Coordenadas">
          <span className={styles.mono}>{formatCoordinate(lon, lat)}</span>
        </Row>
        {selected.description && (
          <Row label="Descrição">
            <p className={styles.description}>{selected.description}</p>
          </Row>
        )}
      </dl>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <dt className={styles.rowLabel}>{label}</dt>
      <dd className={styles.rowValue}>{children}</dd>
    </div>
  );
}

function SeverityBar({ value }: { value: number }) {
  const max = 5;
  const clamped = Math.max(1, Math.min(max, Math.round(value)));
  return (
    <div className={styles.severity} aria-label={`Severidade ${clamped} de ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={styles.severityCell}
          data-active={i < clamped ? 'true' : 'false'}
          data-level={clamped}
        />
      ))}
      <span className={styles.severityValue}>{clamped}/{max}</span>
    </div>
  );
}
