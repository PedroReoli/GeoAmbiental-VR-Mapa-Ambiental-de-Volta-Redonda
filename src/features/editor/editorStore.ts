import { create } from 'zustand';
import type OlMap from 'ol/Map';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import type VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';
import type { LayerId } from '@/shared/constants';

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface EditorState {
  /** Toolbar visivel (controla render do EditorToolbar). */
  open: boolean;
  /** Camada que esta sendo desenhada (null = nao esta desenhando). */
  drawingLayer: LayerId | null;
  /** Feature recem desenhada aguardando metadados (modal aberto). */
  pendingFeature: Feature<Geometry> | null;
  /** Conjunto de camadas com mudancas nao salvas. */
  dirty: Set<LayerId>;
  /** Estado da ultima operacao de save. */
  saveStatus: SaveStatus;
  /** Mensagem de erro (saveStatus === 'error'). */
  saveError: string | null;
  /** Timestamp da ultima save bem sucedida. */
  lastSavedAt: number | null;

  // Refs (registradas pelo useMap)
  mapInstance: OlMap | null;
  layerRefs: Map<LayerId, VectorLayer<VectorSource>>;

  // Actions
  setMap: (map: OlMap | null) => void;
  registerLayer: (id: LayerId, layer: VectorLayer<VectorSource>) => void;

  setOpen: (open: boolean) => void;
  toggleOpen: () => void;

  startDrawing: (layerId: LayerId) => void;
  cancelDrawing: () => void;

  setPendingFeature: (feature: Feature<Geometry> | null) => void;
  /** Confirma a feature desenhada com os metadados informados pelo modal. */
  commitPendingFeature: (props: {
    name: string;
    category?: string;
    description?: string;
    severity?: number;
  }) => void;
  /** Descarta a feature pendente (remove do source). */
  discardPendingFeature: () => void;

  markDirty: (id: LayerId) => void;
  clearDirty: (id?: LayerId) => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  open: false,
  drawingLayer: null,
  pendingFeature: null,
  dirty: new Set(),
  saveStatus: 'idle',
  saveError: null,
  lastSavedAt: null,
  mapInstance: null,
  layerRefs: new Map(),

  setMap: (map) =>
    set(() => ({ mapInstance: map, ...(map === null ? { layerRefs: new Map() } : {}) })),

  registerLayer: (id, layer) =>
    set((state) => {
      const next = new Map(state.layerRefs);
      next.set(id, layer);
      return { layerRefs: next };
    }),

  setOpen: (open) => set({ open }),
  toggleOpen: () => set((s) => ({ open: !s.open })),

  startDrawing: (layerId) => set({ drawingLayer: layerId, pendingFeature: null }),
  cancelDrawing: () => {
    get().discardPendingFeature();
    set({ drawingLayer: null });
  },

  setPendingFeature: (feature) => set({ pendingFeature: feature }),

  commitPendingFeature: ({ name, category, description, severity }) => {
    const state = get();
    const feature = state.pendingFeature;
    const layerId = state.drawingLayer;
    if (!feature || !layerId) return;

    feature.set('id', String(feature.get('id') ?? `${layerId}-${Date.now()}`));
    feature.set('name', name);
    feature.set('layer', layerId);
    if (category) feature.set('category', category);
    if (description) feature.set('description', description);
    if (severity != null) feature.set('severity', severity);
    feature.unset('__pending');

    state.markDirty(layerId);
    set({ pendingFeature: null, drawingLayer: null });
  },

  discardPendingFeature: () => {
    const state = get();
    const feature = state.pendingFeature;
    const layerId = state.drawingLayer;
    if (feature && layerId) {
      const layer = state.layerRefs.get(layerId);
      const source = layer?.getSource();
      if (source) {
        try {
          source.removeFeature(feature);
        } catch {
          /* feature already removed */
        }
      }
    }
    set({ pendingFeature: null });
  },

  markDirty: (id) =>
    set((state) => {
      if (state.dirty.has(id)) return state;
      const next = new Set(state.dirty);
      next.add(id);
      return { dirty: next };
    }),

  clearDirty: (id) =>
    set((state) => {
      if (id == null) return { dirty: new Set() };
      if (!state.dirty.has(id)) return state;
      const next = new Set(state.dirty);
      next.delete(id);
      return { dirty: next };
    }),

  setSaveStatus: (saveStatus, error = null) =>
    set({
      saveStatus,
      saveError: error,
      lastSavedAt: saveStatus === 'success' ? Date.now() : null,
    }),
}));
