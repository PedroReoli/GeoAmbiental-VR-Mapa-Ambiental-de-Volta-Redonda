import { MapView } from '@/features/map';
import { Sidebar } from '@/features/info-panel';
import { APP } from '@/shared/constants';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="Volta Redonda" className={styles.logo} />
          <div className={styles.brandText}>
            <strong>{APP.name}</strong>
            <span>{APP.tagline}</span>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.metaLabel}>Volta Redonda</span>
          <span className={styles.metaValue}>RJ</span>
        </div>
      </header>
      <main className={styles.main}>
        <Sidebar />
        <MapView />
      </main>
    </div>
  );
}
