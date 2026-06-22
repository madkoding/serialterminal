const DB_NAME = 'SerialTerminal'
const DB_VERSION = 1
const STORE_NAME = 'sessions'
const STORE_KEY = 'last-session'

const openDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION)
  request.onupgradeneeded = () => {
    const db = request.result
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  }
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

export const saveSession = async (lines) => {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put({ id: STORE_KEY, lines, updatedAt: Date.now() })
    await tx.done
    db.close()
  } catch (e) {
    console.warn('[logStorage] save failed:', e)
  }
}

export const loadSession = async () => {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const result = await new Promise((resolve, reject) => {
      const req = tx.objectStore(STORE_NAME).get(STORE_KEY)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    await tx.done
    db.close()
    return result?.lines || null
  } catch (e) {
    console.warn('[logStorage] load failed:', e)
    return null
  }
}

export const clearSession = async () => {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(STORE_KEY)
    await tx.done
    db.close()
  } catch (e) {
    console.warn('[logStorage] clear failed:', e)
  }
}
