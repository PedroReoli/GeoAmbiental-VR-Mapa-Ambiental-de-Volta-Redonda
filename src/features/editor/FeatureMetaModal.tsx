import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Modal, Button } from '@/shared/components';
import { LAYERS, LAYER_IDS } from '@/shared/constants';
import { useEditorStore } from './editorStore';
import styles from './FeatureMetaModal.module.css';

export function FeatureMetaModal() {
  const pendingFeature = useEditorStore((s) => s.pendingFeature);
  const drawingTool = useEditorStore((s) => s.drawingTool);
  const commit = useEditorStore((s) => s.commitPendingFeature);
  const discard = useEditorStore((s) => s.discardPendingFeature);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const nameRef = useRef<HTMLInputElement>(null);

  const open = pendingFeature !== null && drawingTool !== null;
  const meta = drawingTool ? LAYERS.find((l) => l.id === drawingTool.layerId) : null;
  const isImpact = drawingTool?.layerId === LAYER_IDS.IMPACT;
  const drawnGeometry = drawingTool?.geometryType ?? null;

  // Reset form sempre que abre um novo
  useEffect(() => {
    if (open) {
      setName('');
      setCategory('');
      setDescription('');
      setSeverity(3);
      // autofocus apos animacao
      setTimeout(() => nameRef.current?.focus(), 60);
    }
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    commit({
      name: name.trim(),
      category: category.trim() || undefined,
      description: description.trim() || undefined,
      severity: isImpact ? severity : undefined,
    });
  }

  function handleCancel() {
    discard();
  }

  if (!meta) return null;
  const accentColor = `var(${meta.colorVar})`;

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title="Detalhes da feature"
      description={
        <span>
          Camada: <strong style={{ color: accentColor }}>{meta.label}</strong>
          {' · '}
          {drawnGeometry === 'Polygon' && 'Polígono fechado'}
          {drawnGeometry === 'LineString' && 'Linha'}
          {drawnGeometry === 'Point' && 'Ponto'}
        </span>
      }
      accentColor={accentColor}
      size="md"
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit} className={styles.form} id="feature-meta-form">
        <Field label="Nome" required>
          <input
            ref={nameRef}
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Parque Aterrado"
            required
            maxLength={120}
          />
        </Field>

        <Field label="Categoria" hint="Opcional. Ex: parque urbano, corrego, residuos solidos">
          <input
            type="text"
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={80}
          />
        </Field>

        {isImpact && (
          <Field
            label="Severidade"
            hint={`Nivel de impacto ambiental (1 = baixo, 5 = alto). Atual: ${severity}`}
          >
            <div className={styles.severityRow}>
              <input
                type="range"
                min={1}
                max={5}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.severityValue} data-level={severity}>
                {severity}
              </div>
            </div>
          </Field>
        )}

        <Field label="Descrição" hint="Opcional. Contexto, fonte ou observações.">
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
      </form>

      <div className={styles.footerActions}>
        <Button variant="ghost" onClick={handleCancel}>
          Descartar
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="feature-meta-form"
          disabled={!name.trim()}
        >
          Salvar feature
        </Button>
      </div>
    </Modal>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}
