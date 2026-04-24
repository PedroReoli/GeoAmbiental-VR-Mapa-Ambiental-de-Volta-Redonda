import { MapView } from '@/features/map';
import { Sidebar } from '@/features/info-panel';
import { APP } from '@/shared/constants';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <img src="/logo.png" alt="Volta Redonda" className={styles.logo} />
          </div>
          <div className={styles.brandText}>
            <strong>{APP.name}</strong>
            <span>
              <span className={styles.brandTagline}>Mapa Ambiental</span>
              <span className={styles.brandSep} aria-hidden>·</span>
              <span className={styles.brandCity}>Volta Redonda · RJ</span>
            </span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Links externos">
          <a
            href={APP.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioLink}
          >
            <span className={styles.portfolioLabel}>por</span>
            <span className={styles.portfolioName}>{APP.author}</span>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              className={styles.externalIcon}
              aria-hidden
            >
              <path
                d="M14 5h5v5M19 5l-9 9M11 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>
      </header>
      <main className={styles.main}>
        <Sidebar />
        <MapView />
      </main>
    </div>
  );
}
