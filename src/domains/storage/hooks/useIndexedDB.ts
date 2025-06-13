import { useEffect, useState } from 'react';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'english-learning-db';
const DB_VERSION = 1;

export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
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
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }
          },
        });
        
        setDb(database);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    initDB();
  }, []);

  const saveData = async (storeName: string, data: any) => {
    if (!db) return;
    try {
      await db.put(storeName, data);
    } catch (error) {
      console.error(`Failed to save to ${storeName}:`, error);
    }
  };

  const getData = async (storeName: string, key: string) => {
    if (!db) return null;
    try {
      return await db.get(storeName, key);
    } catch (error) {
      console.error(`Failed to get from ${storeName}:`, error);
      return null;
    }
  };

  const getAllData = async (storeName: string) => {
    if (!db) return [];
    try {
      return await db.getAll(storeName);
    } catch (error) {
      console.error(`Failed to get all from ${storeName}:`, error);
      return [];
    }
  };

  const deleteData = async (storeName: string, key: string) => {
    if (!db) return;
    try {
      await db.delete(storeName, key);
    } catch (error) {
      console.error(`Failed to delete from ${storeName}:`, error);
    }
  };

  return {
    isReady,
    saveData,
    getData,
    getAllData,
    deleteData,
  };
};