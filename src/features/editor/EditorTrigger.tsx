import { useEditorStore } from './editorStore';
import { cx } from '@/shared/utils/classnames';
import styles from './EditorTrigger.module.css';

export function EditorTrigger() {
  const open = useEditorStore((s) => s.open);
  const dirty = useEditorStore((s) => s.dirty);
  const toggleOpen = useEditorStore((s) => s.toggleOpen);

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className={cx(styles.trigger, open && styles.triggerActive)}
      aria-pressed={open}
      aria-label={open ? 'Fechar editor' : 'Abrir editor'}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
        <path
          d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 6.5l3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.label}>Editor</span>
      <span className={styles.devTag}>dev</span>
      {dirty.size > 0 && (
        <span className={styles.dirtyBadge} aria-label={`${dirty.size} pendente(s)`}>
          {dirty.size}
        </span>
      )}
    </button>
  );
}
