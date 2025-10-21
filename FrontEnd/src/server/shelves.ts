import { http } from '@/server/http'
import { Shelf } from '@/types/shelf'

const KEY = 'shelves'

export const shelvesService = {
  async getAll(): Promise<Shelf[]> {
    return http.get<Shelf[]>(KEY)
  }
}
