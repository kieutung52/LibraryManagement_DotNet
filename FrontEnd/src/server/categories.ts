import { http } from '@/server/http'
import { Category } from '@/types/category'

const KEY = 'categories'

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return http.get<Category[]>(KEY)
  },

  async add(input: Omit<Category, 'id' | 'bookCount'>): Promise<Category> {
    const list = await http.get<Category[]>(KEY)
    const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1
    const item: Category = { id, name: input.name, description: input.description, bookCount: 0 }
    list.push(item)
    await http.set(KEY, list)
    return item
  },

  async remove(id: number) {
    const list = await http.get<Category[]>(KEY)
    await http.set(KEY, list.filter(x => x.id !== id))
  }
}
