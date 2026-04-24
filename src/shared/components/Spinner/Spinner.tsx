import { cx } from '../../utils/classnames';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function Spinner({ size = 'md', label = 'Carregando…', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cx(styles.wrapper, styles[size], className)}
    >
      <span className={styles.spinner} aria-hidden />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
