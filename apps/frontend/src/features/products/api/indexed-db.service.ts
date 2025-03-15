import type { Product } from '../model/types'

const DATABASE_NAME = 'productDatabase'
const STORE_NAME = 'products'

export const productIndexedDbService = {
  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1)

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = (event) =>
        resolve((event.target as IDBOpenDBRequest).result)
      request.onerror = (event) =>
        reject((event.target as IDBOpenDBRequest).error)
    })
  },

  async add(product: Product): Promise<void> {
    const database = await this.openDB()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    store.add(product, product.id)

    return this.handleTransaction(transaction)
  },

  async addQuantity(id: number): Promise<void> {
    const database = await this.openDB()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(id)

    request.onsuccess = () => {
      const product = request.result as Product
      product.stock.currentQuantity += 1
      store.put(product, id)
    }

    return this.handleTransaction(transaction)
  },

  async decreaseQuantity(id: number): Promise<void> {
    const database = await this.openDB()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(id)

    request.onsuccess = () => {
      const product = request.result as Product
      product.stock.currentQuantity -= 1
      store.put(product, id)
    }

    return this.handleTransaction(transaction)
  },

  async getAll(): Promise<Product[]> {
    const database = await this.openDB()
    return new Promise<Product[]>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result as Product[])
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },

  async update(id: number, product: Product): Promise<void> {
    const database = await this.openDB()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    store.delete(id)

    store.add(product, id)

    return this.handleTransaction(transaction)
  },

  async delete(id: number): Promise<void> {
    const database = await this.openDB()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    store.delete(id)

    return this.handleTransaction(transaction)
  },

  async handleTransaction(transaction: IDBTransaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  },
}
