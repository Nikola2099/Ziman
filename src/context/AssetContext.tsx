import React, { createContext, useContext, useReducer } from 'react';
import type { AssetStore, WTG, Trafostanica, Dalekovod, Kabel, Parcela } from '../types';
import { initialData } from '../data/sampleData';

type Action =
  | { type: 'ADD_WTG'; payload: WTG }
  | { type: 'UPDATE_WTG'; payload: WTG }
  | { type: 'DELETE_WTG'; payload: string }
  | { type: 'ADD_TRAFOSTANICA'; payload: Trafostanica }
  | { type: 'UPDATE_TRAFOSTANICA'; payload: Trafostanica }
  | { type: 'DELETE_TRAFOSTANICA'; payload: string }
  | { type: 'ADD_DALEKOVOD'; payload: Dalekovod }
  | { type: 'UPDATE_DALEKOVOD'; payload: Dalekovod }
  | { type: 'DELETE_DALEKOVOD'; payload: string }
  | { type: 'ADD_KABEL'; payload: Kabel }
  | { type: 'UPDATE_KABEL'; payload: Kabel }
  | { type: 'DELETE_KABEL'; payload: string }
  | { type: 'ADD_PARCELA'; payload: Parcela }
  | { type: 'UPDATE_PARCELA'; payload: Parcela }
  | { type: 'DELETE_PARCELA'; payload: string };

function reducer(state: AssetStore, action: Action): AssetStore {
  switch (action.type) {
    case 'ADD_WTG':
      return { ...state, wtgs: [...state.wtgs, action.payload] };
    case 'UPDATE_WTG':
      return { ...state, wtgs: state.wtgs.map(w => w.id === action.payload.id ? action.payload : w) };
    case 'DELETE_WTG':
      return { ...state, wtgs: state.wtgs.filter(w => w.id !== action.payload) };

    case 'ADD_TRAFOSTANICA':
      return { ...state, trafostanice: [...state.trafostanice, action.payload] };
    case 'UPDATE_TRAFOSTANICA':
      return { ...state, trafostanice: state.trafostanice.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRAFOSTANICA':
      return { ...state, trafostanice: state.trafostanice.filter(t => t.id !== action.payload) };

    case 'ADD_DALEKOVOD':
      return { ...state, dalekovodi: [...state.dalekovodi, action.payload] };
    case 'UPDATE_DALEKOVOD':
      return { ...state, dalekovodi: state.dalekovodi.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DALEKOVOD':
      return { ...state, dalekovodi: state.dalekovodi.filter(d => d.id !== action.payload) };

    case 'ADD_KABEL':
      return { ...state, kablovi: [...state.kablovi, action.payload] };
    case 'UPDATE_KABEL':
      return { ...state, kablovi: state.kablovi.map(k => k.id === action.payload.id ? action.payload : k) };
    case 'DELETE_KABEL':
      return { ...state, kablovi: state.kablovi.filter(k => k.id !== action.payload) };

    case 'ADD_PARCELA':
      return { ...state, parcele: [...state.parcele, action.payload] };
    case 'UPDATE_PARCELA':
      return { ...state, parcele: state.parcele.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PARCELA':
      return { ...state, parcele: state.parcele.filter(p => p.id !== action.payload) };

    default:
      return state;
  }
}

interface AssetContextValue {
  state: AssetStore;
  dispatch: React.Dispatch<Action>;
}

const AssetContext = createContext<AssetContextValue | null>(null);

export function AssetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialData);
  return (
    <AssetContext.Provider value={{ state, dispatch }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error('useAssets must be used within AssetProvider');
  return ctx;
}
