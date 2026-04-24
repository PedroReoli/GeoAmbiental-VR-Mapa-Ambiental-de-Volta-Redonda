import { LayerPanel } from '@/features/layers';
import { IbgeCard } from './IbgeCard';
import { FeatureCard } from './FeatureCard';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Painel de informações">
      <div className={styles.scroll}>
        <LayerPanel />
        <FeatureCard />
        <IbgeCard />
      </div>
      <footer className={styles.footer}>
        <span>OpenStreetMap</span>
        <span className={styles.dot} aria-hidden>•</span>
        <span>IBGE</span>
        <span className={styles.dot} aria-hidden>•</span>
        <span className={styles.mockTag}>dados mock</span>
      </footer>
    </aside>
  );
}
