import { Card, Spinner, Badge } from '@/shared/components';
import { formatDecimal, formatInteger } from '@/shared/utils/format';
import { useIbgeStats } from './useIbgeStats';
import styles from './IbgeCard.module.css';

export function IbgeCard() {
  const { status, data, error } = useIbgeStats();

  return (
    <Card
      title="Volta Redonda / RJ"
      subtitle={data?.referenceYear ? `Dados IBGE • ${data.referenceYear}` : 'Dados IBGE'}
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
        <dl className={styles.list}>
          <Stat label="População estimada" value={formatInteger(data.population)} unit="hab" />
          <Stat label="Área territorial" value={formatDecimal(data.area, 3)} unit="km²" />
          <Stat
            label="Densidade demográfica"
            value={formatDecimal(data.density, 2)}
            unit="hab/km²"
          />
          <Stat label="Mesorregião" value={data.region} />
        </dl>
      )}
    </Card>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>
        <span>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </dd>
    </div>
  );
}
