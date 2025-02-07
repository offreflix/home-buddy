import type { Product } from '../model/types'
import { productIndexedDbService } from './indexed-db.service'

export const productApi = {
  async getAllProducts(): Promise<Product[]> {
    return await productIndexedDbService.getAll()
  },

  async addProduct(product: Product): Promise<void> {
    await productIndexedDbService.add(product)
  },

  async updateProduct(id: string, product: Product): Promise<void> {
    await productIndexedDbService.update(id, product)
  },

  async deleteProduct(id: string): Promise<void> {
    await productIndexedDbService.delete(id)
  },
}
