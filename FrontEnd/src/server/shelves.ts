// src/services/shelves.ts
import { http } from './http'
import { Shelf, ShelfBook } from '../types/shelf'
import { authService } from './auth'   

const KEY = 'shelves'

function nextId(items: { id: number }[]) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

function ensureAdmin() {
  const user = authService.getCurrentUser()
  if (!user || user.role !== 'admin') {
    throw new Error('PERMISSION_DENIED')
  }
}

type ShelfCreate = {
  name: string
  code?: string
  description?: string
  capacity: number
  currentLoad?: number
  books?: ShelfBook[]
  status?: Shelf['status']
}

export const shelvesService = {
  async getAll(): Promise<Shelf[]> {
    return http.get<Shelf[]>(KEY)
  },

  async add(input: ShelfCreate): Promise<Shelf> {
    ensureAdmin() 
    const list = await http.get<Shelf[]>(KEY)
    const item: Shelf = {
      id: nextId(list),
      name: input.name,
      code: input.code,
      description: input.description,
      capacity: input.capacity,
      currentLoad: input.currentLoad ?? 0,
      status:
        input.status ??
        ((input.currentLoad ?? 0) >= input.capacity
          ? 'Đầy'
          : (input.currentLoad ?? 0) === 0
            ? 'Trống'
            : 'Đang dùng'),
      books: input.books ?? []
    }
    list.push(item)
    await http.set(KEY, list)
    return item
  },

  async update(id: number, patch: Partial<Shelf>): Promise<Shelf | null> {
    ensureAdmin()
    const list = await http.get<Shelf[]>(KEY)
    const idx = list.findIndex(s => s.id === id)
    if (idx < 0) return null
    const next: Shelf = { ...list[idx], ...patch }
    if (patch.capacity !== undefined || patch.currentLoad !== undefined) {
      const load = next.currentLoad
      next.status = load >= next.capacity ? 'Đầy' : load === 0 ? 'Trống' : 'Đang dùng'
    }
    list[idx] = next
    await http.set(KEY, list)
    return next
  },

  async remove(id: number): Promise<void> {
    ensureAdmin() // 🔐 chỉ admin
    const list = await http.get<Shelf[]>(KEY)
    await http.set(KEY, list.filter(s => s.id !== id))
  }
}
