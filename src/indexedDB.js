const DB_NAME = 'storyAppDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'stories';

// Membuka atau membuat database
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Menyimpan data cerita ke IndexedDB
export const saveStory = async (story) => {
  const db = await openDB();
  const transaction = db.transaction(DB_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(DB_STORE_NAME);
  store.put(story);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(story);
    transaction.onerror = (event) => reject(event.target.error);
  });
};

// Mengambil semua data cerita dari IndexedDB
export const getAllStories = async () => {
  const db = await openDB();
  const transaction = db.transaction(DB_STORE_NAME, 'readonly');
  const store = transaction.objectStore(DB_STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Menghapus data cerita dari IndexedDB berdasarkan ID
export const deleteStory = async (id) => {
  const db = await openDB();
  const transaction = db.transaction(DB_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(DB_STORE_NAME);
  store.delete(id);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
};
