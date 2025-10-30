import { User, Category, Book, BorrowingSlip, BorrowingHistory, DashboardSummary, WeeklyStats, ShelfLocation, BookLocation } from '@/types/typeEntity';

export const mockUsers: User[] = [
  {
    accountId: '1',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@library.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    limitBorrow: 10,
    limitRenew: 3,
    countViolations: 0,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    accountId: '2',
    fullName: 'Trần Thị User',
    email: 'user@example.com',
    role: 'USER',
    status: 'ACTIVE',
    limitBorrow: 5,
    limitRenew: 2,
    countViolations: 1,
    createdAt: '2024-02-20T10:30:00Z'
  }
];

export const mockCategories: Category[] = [
  { categoryId: '1', name: 'Khoa học máy tính', description: 'Sách về lập trình, thuật toán, AI' },
  { categoryId: '2', name: 'Văn học', description: 'Tiểu thuyết, thơ ca, truyện ngắn' },
  { categoryId: '3', name: 'Lịch sử', description: 'Sách về lịch sử thế giới và Việt Nam' },
  { categoryId: '4', name: 'Khoa học tự nhiên', description: 'Vật lý, hóa học, sinh học' },
  { categoryId: '5', name: 'Kinh tế', description: 'Tài chính, quản trị, kinh doanh' }
];

export const mockBooks: Book[] = [
  {
    bookId: '1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    year: 2008,
    isbn: '978-0132350884',
    category: mockCategories[0],
    categoryId: '1',
    availableCopies: 2,
    totalCopies: 3,
    copies: [
      { copyId: '1', barcode: 'BC001', status: 'AVAILABLE' },
      { copyId: '2', barcode: 'BC002', status: 'AVAILABLE' },
      { copyId: '3', barcode: 'BC003', status: 'BORROWED' }
    ],
    description: 'Sách hướng dẫn viết code sạch và dễ bảo trì',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
    coverImage: ''
  },
  {
    bookId: '2',
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    year: 1990,
    isbn: '978-6041234567',
    category: mockCategories[1],
    categoryId: '2',
    availableCopies: 1,
    totalCopies: 2,
    copies: [
      { copyId: '4', barcode: 'BC004', status: 'AVAILABLE' },
      { copyId: '5', barcode: 'BC005', status: 'BORROWED' }
    ],
    description: 'Tiểu thuyết về tuổi thơ và tình yêu đẹp',
    publishedYear: 1990,
    publisher: 'Nhà xuất bản Trẻ',
    coverImage: ''
  },
  {
    bookId: '3',
    title: 'Lịch Sử Việt Nam',
    author: 'Nguyễn Khắc Viện',
    year: 1995,
    isbn: '978-6041234568',
    category: mockCategories[2],
    categoryId: '3',
    availableCopies: 3,
    totalCopies: 3,
    copies: [
      { copyId: '6', barcode: 'BC006', status: 'AVAILABLE' },
      { copyId: '7', barcode: 'BC007', status: 'AVAILABLE' },
      { copyId: '8', barcode: 'BC008', status: 'AVAILABLE' }
    ],
    description: 'Tổng quan về lịch sử Việt Nam',
    publishedYear: 1995,
    publisher: 'Nhà xuất bản Chính trị Quốc gia',
    coverImage: ''
  },
  {
    bookId: '4',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    year: 2009,
    isbn: '978-0262033848',
    category: mockCategories[0],
    categoryId: '1',
    availableCopies: 0,
    totalCopies: 2,
    copies: [
      { copyId: '9', barcode: 'BC009', status: 'BORROWED' },
      { copyId: '10', barcode: 'BC010', status: 'BORROWED' }
    ],
    description: 'Giáo trình về thuật toán và cấu trúc dữ liệu',
    publishedYear: 2009,
    publisher: 'MIT Press',
    coverImage: ''
  },
  {
    bookId: '5',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    year: 2011,
    isbn: '978-0062316097',
    category: mockCategories[2],
    categoryId: '3',
    availableCopies: 2,
    totalCopies: 2,
    copies: [
      { copyId: '11', barcode: 'BC011', status: 'AVAILABLE' },
      { copyId: '12', barcode: 'BC012', status: 'AVAILABLE' }
    ],
    description: 'Lịch sử của loài người từ thời kỳ đá đến hiện đại',
    publishedYear: 2011,
    publisher: 'Harper',
    coverImage: ''
  }
];

export const mockBorrowingSlips: BorrowingSlip[] = [
  {
    slipId: '1',
    user: mockUsers[1],
    books: [
      { book: mockBooks[0], barcode: 'BC003' }
    ],
    borrowDate: '2024-01-20T09:00:00Z',
    dueDate: '2024-02-20T23:59:59Z',
    status: 'APPROVED'
  },
  {
    slipId: '2',
    user: mockUsers[1],
    books: [
      { book: mockBooks[3], barcode: 'BC009' }
    ],
    borrowDate: '2024-02-15T10:30:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    status: 'OVERDUE'
  }
];

export const mockBorrowingHistory: BorrowingHistory[] = [
  {
    slipId: '1',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    barcode: 'BC003',
    borrowDate: '2024-01-20T09:00:00Z',
    dueDate: '2024-02-20T23:59:59Z',
    status: 'APPROVED'
  },
  {
    slipId: '2',
    bookTitle: 'Introduction to Algorithms',
    barcode: 'BC009',
    borrowDate: '2024-02-15T10:30:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    status: 'OVERDUE'
  }
];

export const mockDashboardSummary: DashboardSummary = {
  pendingRequests: 5,
  borrowedToday: 12,
  overdueBooks: 3,
  activeUsers: 45
};

export const mockWeeklyStats: WeeklyStats[] = [
  { week: 'Tuần 1', borrowings: 45, violations: 2 },
  { week: 'Tuần 2', borrowings: 52, violations: 1 },
  { week: 'Tuần 3', borrowings: 38, violations: 3 },
  { week: 'Tuần 4', borrowings: 61, violations: 0 }
];

export const mockShelfLocations: ShelfLocation[] = [
  {
    shelfLocationId: '1',
    locationName: 'Kệ A1',
    description: 'Kệ sách khoa học máy tính và công nghệ',
    status: 'OCCUPIED',
    capacity: 50,
    currentBooks: 35,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    shelfLocationId: '2',
    locationName: 'Kệ A2',
    description: 'Kệ sách văn học Việt Nam',
    status: 'OCCUPIED',
    capacity: 60,
    currentBooks: 45,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z'
  },
  {
    shelfLocationId: '3',
    locationName: 'Kệ B1',
    description: 'Kệ sách lịch sử và địa lý',
    status: 'OCCUPIED',
    capacity: 40,
    currentBooks: 28,
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-02-20T11:15:00Z'
  },
  {
    shelfLocationId: '4',
    locationName: 'Kệ B2',
    description: 'Kệ sách khoa học tự nhiên',
    status: 'EMPTY',
    capacity: 50,
    currentBooks: 0,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    shelfLocationId: '5',
    locationName: 'Kệ C1',
    description: 'Kệ sách kinh tế và quản trị',
    status: 'FULL',
    capacity: 30,
    currentBooks: 30,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-03-01T09:45:00Z'
  }
];

export const mockBookLocations: BookLocation[] = [
  {
    bookLocationId: '1',
    bookId: '1',
    book: mockBooks[0],
    shelfLocationId: '1',
    shelfLocation: mockShelfLocations[0],
    createdAt: '2024-01-05T08:30:00Z'
  },
  {
    bookLocationId: '2',
    bookId: '4',
    book: mockBooks[3],
    shelfLocationId: '1',
    shelfLocation: mockShelfLocations[0],
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    bookLocationId: '3',
    bookId: '2',
    book: mockBooks[1],
    shelfLocationId: '2',
    shelfLocation: mockShelfLocations[1],
    createdAt: '2024-01-08T10:20:00Z'
  },
  {
    bookLocationId: '4',
    bookId: '3',
    book: mockBooks[2],
    shelfLocationId: '3',
    shelfLocation: mockShelfLocations[2],
    createdAt: '2024-01-12T11:30:00Z'
  },
  {
    bookLocationId: '5',
    bookId: '5',
    book: mockBooks[4],
    shelfLocationId: '3',
    shelfLocation: mockShelfLocations[2],
    createdAt: '2024-01-15T14:45:00Z'
  }
];