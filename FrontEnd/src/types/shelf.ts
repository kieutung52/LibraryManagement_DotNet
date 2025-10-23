export type ShelfBook = { title: string; author: string; category: string; quantity: number }

export type Shelf = {
  id: number
  name: string
  code?: string                // ✅ thêm mã kệ để hiển thị như demo
  description?: string
  capacity: number
  currentLoad: number
  status: 'Đang dùng' | 'Trống' | 'Đầy'
  books?: ShelfBook[]
}

