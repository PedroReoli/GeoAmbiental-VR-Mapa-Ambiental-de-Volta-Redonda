import { create } from 'zustand';
import type OlMap from 'ol/Map';
import type VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';
import type { LayerId } from '@/shared/constants';

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface EditorState {
  /** Toggle global do modo de edicao. */
  enabled: boolean;
  /** Conjunto de camadas com mudancas nao salvas. */
  dirty: Set<LayerId>;
  /** Estado da ultima operacao de save. */
  saveStatus: SaveStatus;
  /** Mensagem de erro caso saveStatus === 'error'. */
  saveError: string | null;
  /** Timestamp da ultima save bem sucedida (para feedback efemero). */
  lastSavedAt: number | null;

  // Refs (registradas pelo useMap; nao reativas — acessadas via getState)
  mapInstance: OlMap | null;
  layerRefs: Map<LayerId, VectorLayer<VectorSource>>;

  // Actions
  setMap: (map: OlMap | null) => void;
  registerLayer: (id: LayerId, layer: VectorLayer<VectorSource>) => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  markDirty: (id: LayerId) => void;
  clearDirty: (id?: LayerId) => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  enabled: false,
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

  setEnabled: (enabled) => set({ enabled }),

  toggleEnabled: () => set((s) => ({ enabled: !s.enabled })),

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
