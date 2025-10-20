import { booksService } from './books'
import { borrowingsService } from './borrowings'
import { http } from './http'

export const adminService = {
  async getKpi() {
    const books = await booksService.getAll()
    const borrows = await borrowingsService.getAll()
    const users = http.readRaw<any[]>('users', [])
    return {
      totalBooks: books.length,
      totalUsers: users.length,
      totalBorrows: borrows.length,
      satisfaction: 98
    }
  },

  async getMonthlyBorrowStats() {
    // Giả lập 12 tháng
    const labels = ['1','2','3','4','5','6','7','8','9','10','11','12'].map(m => `Tháng ${m}`)
    // Random nhẹ dựa vào tổng mượn hiện có
    const total = (await borrowingsService.getAll()).length || 8
    const values = labels.map((_, i) => Math.max(1, Math.round(total + (i % 5) - 2)))
    return { labels, values }
  }
}
