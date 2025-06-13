import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppPage, AppState, AppStore } from '../types/appTypes';

const defaultState: AppState = {
  currPage: 'dashboard',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      state: defaultState,

      setPage: (pageId: AppPage) =>
        set((state) => ({
          state: {
            ...state.state,
            currPage: pageId,
          },
        })),
    }),
    {
      name: 'app-storage',
      onRehydrateStorage: () => (state) => {
        console.log('✅ App state rehydrated:', state?.state);
      },
    }
  )
);
