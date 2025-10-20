import { http } from './http'
import { Book } from '../types/book'

const KEY = 'books'

export const booksService = {
  async getAll(): Promise<Book[]> {
    return http.get<Book[]>(KEY)
  },

  async add(book: Omit<Book, 'id'>): Promise<Book> {
    const list = await http.get<Book[]>(KEY)
    const id = list.length ? Math.max(...list.map(b => b.id)) + 1 : 1
    const item = { ...book, id }
    list.push(item)
    await http.set(KEY, list)
    return item
  }
}
