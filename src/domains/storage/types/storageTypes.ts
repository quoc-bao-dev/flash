export interface StorageData {
  flashcards: any[];
  topics: any[];
  stats: any;
  gamification: any;
  settings: any;
  lastSync?: Date;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

export interface StorageStore {
  syncStatus: SyncStatus;
  isOffline: boolean;
  
  // Actions
  initializeStorage: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  syncToCloud: () => Promise<void>;
  clearAllData: () => Promise<void>;
  getStorageUsage: () => Promise<number>;
  compressData: (data: any) => string;
  decompressData: (data: string) => any;
}