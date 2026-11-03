/**
 * AgriBridge Rwanda — Local IndexedDB Conversation Storage
 * Privacy-conscious offline storage for farmer chats with zero cloud sync requirement.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  engineUsed: 'online_gemini' | 'local_knowledge' | 'local_model';
  platformAction?: {
    tab: string;
    labelEn: string;
    labelRw: string;
  };
  feedback?: 'helpful' | 'unhelpful';
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  language: 'en' | 'rw';
}

const DB_NAME = 'agribridge_ai_db';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback to localStorage if IndexedDB is restricted
function getLocalStorageConversations(): ConversationSession[] {
  try {
    const raw = localStorage.getItem('agribridge_offline_conversations');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalStorageConversations(data: ConversationSession[]) {
  try {
    localStorage.setItem('agribridge_offline_conversations', JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage quota reached', e);
  }
}

export async function getAllConversations(): Promise<ConversationSession[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const sorted = (request.result as ConversationSession[]).sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(sorted);
      };
      request.onerror = () => {
        resolve(getLocalStorageConversations());
      };
    });
  } catch {
    return getLocalStorageConversations();
  }
}

export async function saveConversation(session: ConversationSession): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const all = getLocalStorageConversations().filter((s) => s.id !== session.id);
    all.unshift(session);
    setLocalStorageConversations(all);
  }
}

export async function deleteConversation(sessionId: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(sessionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const filtered = getLocalStorageConversations().filter((s) => s.id !== sessionId);
    setLocalStorageConversations(filtered);
  }
}

export async function clearAllConversations(): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.removeItem('agribridge_offline_conversations');
  }
}
