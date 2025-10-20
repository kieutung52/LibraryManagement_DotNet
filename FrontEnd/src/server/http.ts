// Fake HTTP layer over localStorage with minimal delay

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms))
const LS = {
  get<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

function seedOnce() {
  if (!localStorage.getItem('__seeded__')) {
    // users
    LS.set('users', [
      { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@library.com', role: 'admin', status: 'Hoạt động', joinDate: '20/1/2023', violations: 0, limit: 5 },
      { id: 2, name: 'Trần Thị User', email: 'user@example.com', role: 'user', status: 'Hoạt động', joinDate: '15/2/2023', violations: 1, limit: 2 }
    ])

    // books
    LS.set('books', [
      { id: 1, title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', year: 2008, stock: 3, available: 2, category: 'Khoa học máy tính', code: 'BC003', description: 'Một cuốn sách kinh điển về cách viết mã sạch và dễ bảo trì, áp dụng các nguyên tắc Agile.' },
      { id: 2, title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', year: 1990, stock: 3, available: 1, category: 'Văn học', code: 'VB001', description: 'Câu chuyện tình yêu tuổi học trò nhẹ nhàng, lãng mạn.' },
      { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', year: 2009, stock: 3, available: 0, category: 'Khoa học máy tính', code: 'BC009', description: 'Giới thiệu toàn diện về các thuật toán và cấu trúc dữ liệu.' },
      { id: 4, title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', year: 2011, stock: 3, available: 2, category: 'Lịch sử', code: 'LS005', description: 'Cuộc hành trình từ nguồn gốc loài người đến tương lai.' }
    ])

    // categories
    LS.set('categories', [
      { id: 1, name: 'Khoa học máy tính', description: 'Sách về lập trình, thuật toán, AI', bookCount: 2 },
      { id: 2, name: 'Văn học', description: 'Tiểu thuyết, thơ ca, truyện ngắn', bookCount: 1 },
      { id: 3, name: 'Lịch sử', description: 'Sách về lịch sử thế giới và Việt Nam', bookCount: 1 },
      { id: 4, name: 'Kinh tế', description: 'Tài chính, quản trị, kinh doanh', bookCount: 0 }
    ])

    // shelves
    LS.set('shelves', [
      { id: 1, name: 'Kệ A1', description: 'Kệ sách khoa học máy tính và công nghệ', capacity: 50, currentLoad: 35, status: 'Đang dùng' },
      { id: 2, name: 'Kệ A2', description: 'Kệ sách văn học Việt Nam', capacity: 60, currentLoad: 45, status: 'Đang dùng', books: [{title:'Mắt Biếc', author:'Nguyễn Nhật Ánh', category:'Văn học', quantity:1}] },
      { id: 3, name: 'Kệ B1', description: 'Kệ sách lịch sử và địa lý', capacity: 40, currentLoad: 28, status: 'Đang dùng' },
      { id: 4, name: 'Kệ B2', description: 'Kệ sách khoa học tự nhiên', capacity: 50, currentLoad: 0, status: 'Trống' },
      { id: 5, name: 'Kệ C1', description: 'Kệ sách kinh tế và quản trị', capacity: 30, currentLoad: 30, status: 'Đầy' }
    ])

    // borrowings
    LS.set('borrowings', [
      { id: 1, user: 'Trần Thị User', email: 'user@example.com', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', code: 'BC003', borrowDate: '20/1/2024', dueDate: '21/2/2024', status: 'Đã duyệt' },
      { id: 2, user: 'Trần Thị User', email: 'user@example.com', title: 'Introduction to Algorithms', code: 'BC009', borrowDate: '15/2/2024', dueDate: '16/3/2024', status: 'Quá hạn' },
      { id: 3, user: 'Nguyễn Văn User', email: 'user2@example.com', title: "The Hitchhiker's Guide to the Galaxy", code: 'KH010', borrowDate: '01/3/2024', dueDate: '01/4/2024', status: 'Chờ duyệt' },
      { id: 4, user: 'Lê Văn B', email: 'levanb@example.com', title: 'The Lord of the Rings', code: 'VH005', borrowDate: '01/1/2024', dueDate: '01/2/2024', status: 'Quá hạn' }
    ])

    localStorage.setItem('__seeded__', '1')
  }
}
seedOnce()

export const http = {
  async get<T>(key: string): Promise<T> {
    await delay()
    return LS.get<T>(key, [] as unknown as T)
  },
  async set<T>(key: string, value: T): Promise<void> {
    await delay()
    LS.set<T>(key, value)
  },
  readRaw<T>(key: string, fallback: T): T {
    return LS.get<T>(key, fallback)
  }
}
