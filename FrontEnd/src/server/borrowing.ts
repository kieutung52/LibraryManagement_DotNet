import { http } from '@/server/http'
import { Borrowing, BorrowStatus } from '@/types/borrowing'

const KEY = 'borrowings'

export const borrowingsService = {
  async getAll(): Promise<Borrowing[]> {
    return http.get<Borrowing[]>(KEY)
  },

  async getByEmail(email: string): Promise<Borrowing[]> {
    const all = await http.get<Borrowing[]>(KEY)
    return all.filter(b => b.email.toLowerCase() === email.toLowerCase())
  },

  async add(req: Omit<Borrowing, 'id' | 'status'> & { status?: BorrowStatus }): Promise<Borrowing> {
    const list = await http.get<Borrowing[]>(KEY)
    const id = list.length ? Math.max(...list.map(b => b.id)) + 1 : 1
    const item: Borrowing = { id, status: req.status ?? 'Chờ duyệt', ...req }
    list.push(item)
    await http.set(KEY, list)
    return item
  },

  async updateStatus(id: number, status: BorrowStatus) {
    const list = await http.get<Borrowing[]>(KEY)
    const idx = list.findIndex(b => b.id === id)
    if (idx >= 0) {
      list[idx].status = status
      await http.set(KEY, list)
    }
  }
}
