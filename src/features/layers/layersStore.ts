import { create } from 'zustand';
import { LAYERS, type LayerId } from '@/shared/constants';
import type { SelectedFeature } from '@/shared/types';

interface LayersState {
  /** Mapa de visibilidade de cada camada (id → boolean). */
  visibility: Record<LayerId, boolean>;
  /** Termo de busca aplicado às features. */
  searchTerm: string;
  /** Feature atualmente selecionada no mapa (clique ou busca). */
  selectedFeature: SelectedFeature | null;

  toggleLayer: (id: LayerId) => void;
  setLayerVisible: (id: LayerId, visible: boolean) => void;
  showAll: () => void;
  hideAll: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedFeature: (feature: SelectedFeature | null) => void;
}

const initialVisibility = LAYERS.reduce<Record<LayerId, boolean>>(
  (acc, layer) => {
    acc[layer.id] = true;
    return acc;
  },
  {} as Record<LayerId, boolean>,
);

export const useLayersStore = create<LayersState>((set) => ({
  visibility: initialVisibility,
  searchTerm: '',
  selectedFeature: null,

  toggleLayer: (id) =>
    set((state) => ({
      visibility: { ...state.visibility, [id]: !state.visibility[id] },
    })),

  setLayerVisible: (id, visible) =>
    set((state) => ({
      visibility: { ...state.visibility, [id]: visible },
    })),

  showAll: () =>
    set(() => ({
      visibility: LAYERS.reduce<Record<LayerId, boolean>>(
        (acc, layer) => {
          acc[layer.id] = true;
          return acc;
        },
        {} as Record<LayerId, boolean>,
      ),
    })),

  hideAll: () =>
    set(() => ({
      visibility: LAYERS.reduce<Record<LayerId, boolean>>(
        (acc, layer) => {
          acc[layer.id] = false;
          return acc;
        },
        {} as Record<LayerId, boolean>,
      ),
    })),

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedFeature: (selectedFeature) => set({ selectedFeature }),
}));
