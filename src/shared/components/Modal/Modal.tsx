import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/classnames';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Largura do dialog. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Fechar ao clicar fora. Default: true */
  closeOnOverlayClick?: boolean;
  /** Fechar com Escape. Default: true */
  closeOnEsc?: boolean;
  /** Adiciona uma faixa de cor no topo (ex: cor da camada). */
  accentColor?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  accentColor,
}: ModalProps) {
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onClose]);

  // Bloqueia scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => closeOnOverlayClick && onClose()}
      role="presentation"
    >
      <div
        className={cx(styles.dialog, styles[size])}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        {accentColor && (
          <div className={styles.accent} style={{ backgroundColor: accentColor }} aria-hidden />
        )}
        <header className={styles.header}>
          <div className={styles.titles}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
