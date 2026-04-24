import { useEffect, useState } from 'react';
import { getMunicipalityStats } from '@/services/ibge';
import type { AsyncStatus, IBGEMunicipalityStats } from '@/shared/types';

interface State {
  status: AsyncStatus;
  data: IBGEMunicipalityStats | null;
  error: string | null;
}

const initial: State = { status: 'idle', data: null, error: null };

export function useIbgeStats(): State {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: 'loading', data: null, error: null });

    getMunicipalityStats(undefined, ctrl.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        const msg = err instanceof Error ? err.message : 'Falha ao carregar dados do IBGE';
        setState({ status: 'error', data: null, error: msg });
      });

    return () => ctrl.abort();
  }, []);

  return state;
}
