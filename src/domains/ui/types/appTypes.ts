export type AppPage =
  | 'dashboard'
  | 'topics'
  | 'flashcards'
  | 'library'
  | 'learning'
  | 'stats'
  | 'achievements'
  | 'settings';

export interface AppState {
  currPage: string;
}
export interface AppStore {
  state: AppState;

  // Actions
  setPage: (pageId: AppPage) => void;
}
