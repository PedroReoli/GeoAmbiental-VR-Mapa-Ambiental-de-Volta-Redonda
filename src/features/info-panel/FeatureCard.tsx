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
      <Card
        title="Seleção"
        subtitle="Nenhuma feature ativa"
        padded={false}
        style={{ '--card-accent': 'var(--color-ink-400)' } as React.CSSProperties}
      >
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.2" fill="currentColor" />
            </svg>
          </span>
          <p>Clique em qualquer feature do mapa para inspecionar.</p>
        </div>
      </Card>
    );
  }

  const layerMeta = LAYERS.find((l) => l.id === selected.layer);
  const layerColor = layerMeta ? `var(${layerMeta.colorVar})` : undefined;
  const layerFill = layerMeta ? `var(${layerMeta.fillVar})` : undefined;
  const [lon, lat] = selected.coordinates;

  return (
    <Card
      title="Seleção"
      subtitle={selected.name}
      padded={false}
      actions={
        <Button size="sm" variant="ghost" onClick={() => clear(null)} aria-label="Fechar detalhes">
          ×
        </Button>
      }
      style={
        {
          '--feature-accent': layerColor,
          '--feature-accent-fill': layerFill,
          '--card-accent': layerColor,
        } as React.CSSProperties
      }
      className={styles.featureCard}
    >
      <div className={styles.tag}>
        <Badge color={layerColor}>{selected.layerLabel}</Badge>
        {selected.category && <span className={styles.category}>{selected.category}</span>}
      </div>

      <dl className={styles.list}>
        {selected.severity != null && (
          <Row label="Severidade">
            <SeverityBar value={selected.severity} />
          </Row>
        )}
        <Row label="Geometria">
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
      <div className={styles.severityCells}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={styles.severityCell}
            data-active={i < clamped ? 'true' : 'false'}
            data-level={clamped}
          />
        ))}
      </div>
      <span className={styles.severityValue}>{clamped}/{max}</span>
    </div>
  );
}
