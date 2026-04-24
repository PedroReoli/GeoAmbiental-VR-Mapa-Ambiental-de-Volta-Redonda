import { MapView } from '@/features/map';
import { Sidebar } from '@/features/info-panel';
import { APP } from '@/shared/constants';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M12 2C7.5 6.5 5 10 5 14a7 7 0 1 0 14 0c0-4-2.5-7.5-7-12Z"
                fill="currentColor"
                opacity="0.85"
              />
              <path d="M12 7v12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className={styles.brandText}>
            <strong>{APP.name}</strong>
            <span>{APP.tagline}</span>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Sidebar />
        <MapView />
      </main>
    </div>
  );
}
