import { Card, Spinner, Badge } from '@/shared/components';
import { formatDecimal, formatInteger } from '@/shared/utils/format';
import { useIbgeStats } from './useIbgeStats';
import styles from './IbgeCard.module.css';

export function IbgeCard() {
  const { status, data, error } = useIbgeStats();

  return (
    <Card
      title="Dados IBGE"
      subtitle={
        data?.referenceYear
          ? `${data.name ?? 'Volta Redonda'} • ${data.referenceYear}`
          : data?.name ?? 'Volta Redonda • RJ'
      }
      padded={false}
    >
      {status === 'loading' && (
        <div className={styles.center}>
          <Spinner label="Carregando dados do IBGE" />
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <Badge tone="danger">Erro</Badge>
          <p>{error}</p>
        </div>
      )}

      {status === 'success' && data && (
        <>
          <div className={styles.grid}>
            <Stat label="População" value={formatInteger(data.population)} unit="hab" />
            <Stat label="Área" value={formatDecimal(data.area, 1)} unit="km²" />
            <Stat
              label="Densidade"
              value={formatDecimal(data.density, 1)}
              unit="hab/km²"
            />
            <Stat label="Estado" value={data.state ?? '—'} />
          </div>
          {data.region && (
            <div className={styles.region}>
              <span className={styles.regionLabel}>Mesorregião</span>
              <span className={styles.regionValue}>{data.region}</span>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
    </div>
  );
}
