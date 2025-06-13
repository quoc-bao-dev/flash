import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageStore, StorageData, SyncStatus } from '../types/storageTypes';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'english-learning-db';
const DB_VERSION = 1;

export const useStorageStore = create<StorageStore>()(
  persist(
    (set, get) => ({
      syncStatus: {
        isOnline: navigator.onLine,
        lastSync: null,
        pendingChanges: 0,
        syncInProgress: false,
      },
      isOffline: !navigator.onLine,

      initializeStorage: async () => {
        try {
          const db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
              if (!db.objectStoreNames.contains('flashcards')) {
                db.createObjectStore('flashcards', { keyPath: 'id' });
              }
              if (!db.objectStoreNames.contains('topics')) {
                db.createObjectStore('topics', { keyPath: 'id' });
              }
              if (!db.objectStoreNames.contains('stats')) {
                db.createObjectStore('stats', { keyPath: 'id' });
              }
            },
          });
          
          // Listen for online/offline events
          window.addEventListener('online', () => {
            set((state) => ({
              isOffline: false,
              syncStatus: { ...state.syncStatus, isOnline: true },
            }));
          });
          
          window.addEventListener('offline', () => {
            set((state) => ({
              isOffline: true,
              syncStatus: { ...state.syncStatus, isOnline: false },
            }));
          });
        } catch (error) {
          console.error('Failed to initialize storage:', error);
        }
      },

      exportData: async () => {
        try {
          const db = await openDB(DB_NAME, DB_VERSION);
          const data: StorageData = {
            flashcards: await db.getAll('flashcards'),
            topics: await db.getAll('topics'),
            stats: await db.getAll('stats'),
            gamification: {},
            settings: {},
            lastSync: new Date(),
          };
          
          return get().compressData(data);
        } catch (error) {
          console.error('Export failed:', error);
          return '';
        }
      },

      importData: async (jsonData) => {
        try {
          const data = get().decompressData(jsonData);
          const db = await openDB(DB_NAME, DB_VERSION);
          
          // Clear existing data
          await db.clear('flashcards');
          await db.clear('topics');
          await db.clear('stats');
          
          // Import new data
          if (data.flashcards) {
            for (const item of data.flashcards) {
              await db.add('flashcards', item);
            }
          }
          
          if (data.topics) {
            for (const item of data.topics) {
              await db.add('topics', item);
            }
          }
          
          if (data.stats) {
            for (const item of data.stats) {
              await db.add('stats', item);
            }
          }
        } catch (error) {
          console.error('Import failed:', error);
        }
      },

      syncToCloud: async () => {
        set((state) => ({
          syncStatus: { ...state.syncStatus, syncInProgress: true },
        }));
        
        try {
          // Mock cloud sync - in real app would use Firebase/Supabase
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          set((state) => ({
            syncStatus: {
              ...state.syncStatus,
              syncInProgress: false,
              lastSync: new Date(),
              pendingChanges: 0,
            },
          }));
        } catch (error) {
          set((state) => ({
            syncStatus: { ...state.syncStatus, syncInProgress: false },
          }));
          console.error('Sync failed:', error);
        }
      },

      clearAllData: async () => {
        try {
          const db = await openDB(DB_NAME, DB_VERSION);
          await db.clear('flashcards');
          await db.clear('topics');
          await db.clear('stats');
          
          // Clear localStorage
          localStorage.clear();
        } catch (error) {
          console.error('Clear data failed:', error);
        }
      },

      getStorageUsage: async () => {
        try {
          if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return estimate.usage || 0;
          }
          return 0;
        } catch (error) {
          console.error('Storage usage check failed:', error);
          return 0;
        }
      },

      compressData: (data) => {
        return JSON.stringify(data);
      },

      decompressData: (data) => {
        return JSON.parse(data);
      },
    }),
    {
      name: 'storage-storage',
    }
  )
);