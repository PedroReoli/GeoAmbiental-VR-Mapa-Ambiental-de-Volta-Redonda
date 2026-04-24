import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classnames';
import styles from './Badge.module.css';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  /** Cor customizada (sobrescreve `tone`). Aceita CSS color/var. */
  color?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', color, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, !color && styles[tone], className)}
      style={
        color
          ? { backgroundColor: `${color}22`, color, borderColor: `${color}55` }
          : undefined
      }
      {...rest}
    >
      {children}
    </span>
  );
}
