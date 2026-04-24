import type { ReactNode } from 'react';
import { cx } from '../../utils/classnames';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  /** Cor de destaque opcional (ex: cor da camada). */
  accentColor?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  accentColor,
  disabled,
  id,
}: ToggleProps) {
  const inputId = id ?? `toggle-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <label htmlFor={inputId} className={cx(styles.row, disabled && styles.disabled)}>
      <span
        className={cx(styles.switch, checked && styles.checked)}
        style={accentColor && checked ? { backgroundColor: accentColor } : undefined}
      >
        <input
          id={inputId}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className={styles.thumb} aria-hidden />
      </span>
      {(label || description) && (
        <span className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}
    </label>
  );
}
