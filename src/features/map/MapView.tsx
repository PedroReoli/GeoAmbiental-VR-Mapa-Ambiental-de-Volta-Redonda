import 'ol/ol.css';
import { useMap } from './useMap';
import styles from './MapView.module.css';

export function MapView() {
  const { containerRef } = useMap();
  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.map} role="application" aria-label="Mapa de Volta Redonda" />
    </div>
  );
}
