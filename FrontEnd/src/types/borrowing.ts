export type BorrowStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Đã trả' | 'Quá hạn' | 'Đã hủy'

export type Borrowing = {
  id: number
  user: string
  email: string
  title: string
  code: string
  borrowDate: string
  dueDate: string
  status: BorrowStatus
}
