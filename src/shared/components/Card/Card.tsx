import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classnames';
import styles from './Card.module.css';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
}

export function Card({
  title,
  subtitle,
  actions,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = title || subtitle || actions;
  return (
    <section className={cx(styles.card, className)} {...rest}>
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.titles}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={cx(styles.body, padded && styles.padded)}>{children}</div>
    </section>
  );
}
