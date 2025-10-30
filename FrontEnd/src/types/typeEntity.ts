// ======================================================
// ENUMS (Dựa trên DTO/enum_data/)
// ======================================================

// Dựa trên DTO/enum_data/AccountStatus.cs [cite: 100]
export enum AccountStatus {
  ACTIVE,
  SUSPENDED,
  BANNED,
}

// Dựa trên DTO/enum_data/BorrowingDetailStatus.cs
export enum BorrowingDetailStatus {
  PENDING,
  BORROWING,
  RETURNED,
  OVERDUE,
  LOST,
}

// Dựa trên DTO/enum_data/BorrowingStatus.cs [cite: 98]
export enum BorrowingStatus {
  PENDING,
  APPROVED,
  REJECTED,
  COMPLETED,
}

// Dựa trên DTO/enum_data/ShelfStatus.cs [cite: 97]
export enum ShelfStatus {
  EMPTY,
  OCCUPIED,
  FULL,
}

// Dựa trên DTO/enum_data/StaffPosition.cs [cite: 99]
export enum StaffPosition {
  LIBRARIAN,
  DIRECTOR,
}

// ======================================================
// ENTITIES (Dựa trên DTO/response/)
// ======================================================

// Dựa trên DTO/response/users/AdminData.cs [cite: 74]
export interface AdminData {
  staffCode: string; // Guid trong C# được map sang string
  position: string; // Backend trả về string [cite: 74]
}

// Dựa trên DTO/response/users/UserData.cs [cite: 75-77]
export interface UserData {
  limitRenew?: number | null;
  countRenew?: number | null;
  limitBorrow?: number | null;
  countBorrow?: number | null;
  countViolations?: number | null;
}

// Dựa trên DTO/response/users/UserResponse.cs [cite: 69-72]
export interface UserResponse {
  accountID: string; // Guid
  role: string;
  email: string;
  fullName: string;
  status: string; // Backend trả về string[cite: 71], có thể cần map sang AccountStatus enum
  adminData?: AdminData | null;
  userData?: UserData | null;
}

// Dựa trên DTO/response/library/books/BookResponse.cs [cite: 78-83]
export interface BookResponse {
  bookID: number;
  isbn: string;
  title: string;
  author: string;
  categoryID?: number | null;
  categoryName?: string | null;
  publicationYear?: number | null;
  totalQuantity: number;
  availableQuantity: number;
}

// Dựa trên DTO/response/library/category/CategoryResponse.cs [cite: 84, 85]
export interface CategoryResponse {
  categoryID: number;
  name: string;
  description?: string | null;
}

// Dựa trên DTO/response/library/shelf/ShelfResponse.cs [cite: 86-88]
export interface ShelfResponse {
  shelfID: number;
  locationName: string;
  description?: string | null;
  status: ShelfStatus; // Backend trả về enum [cite: 87]
  capacity: number;
}

// Dựa trên DTO/response/borrowing/BorrowingDetailResponse.cs [cite: 64-68]
export interface BorrowingDetailResponse {
  borrowingDetailID: number;
  bookID: number;
  bookTitle: string;
  quantityBook: number;
  dueDate: string; // DateTime trong C# được map sang string
  returnDate?: string | null; // DateTime?
  status: BorrowingDetailStatus; // Backend trả về enum [cite: 68]
}

// Dựa trên DTO/response/borrowing/BorrowingResponse.cs [cite: 60-63]
export interface BorrowingResponse {
  borrowingID: number;
  accountID: string; // Guid
  staffID?: string | null; // Guid?
  borrowDate: string; // DateTime
  status: BorrowingStatus; // Backend trả về enum [cite: 63]
  details: BorrowingDetailResponse[];
}

// Dựa trên models/DataAnalyticsDaily.cs [cite: 56-59] (được trả về từ AdminController [cite: 158])
export interface DataAnalyticsDaily {
  dataAnalyticsID: number;
  reportDate: string; // DateTime
  countBorrowings: number;
  countUsersViolations: number;
  countUsersVisited: number;
  countUserBack: number;
  countBorrowingsToExpire: number;
  countBorrowingsRequestPending: number;
  // Các trường này từ BaseEntity [cite: 43]
  createdAt: string; 
  updatedAt: string;
}

export interface User {
  accountId: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  limitBorrow: number;
  limitRenew: number;
  countViolations: number;
  createdAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface BookCopy {
  copyId: string;
  barcode: string;
  status: 'AVAILABLE' | 'BORROWED' | 'DAMAGED';
}

export interface Book {
  bookId: string;
  title: string;
  author: string;
  year: number;
  isbn: string;
  category: Category;
  categoryId: string;
  availableCopies: number;
  totalCopies: number;
  copies: BookCopy[];
  description: string;
  publishedYear: number;
  publisher: string;
  coverImage: string;
}

export interface BorrowingSlip {
  slipId: string;
  user: User;
  books: Array<{
    book: Book;
    barcode: string;
  }>;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'OVERDUE';
}

export interface BorrowingHistory {
  slipId: string;
  bookTitle: string;
  barcode: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'OVERDUE';
}

export interface DashboardSummary {
  pendingRequests: number;
  borrowedToday: number;
  overdueBooks: number;
  activeUsers: number;
}

export interface WeeklyStats {
  week: string;
  borrowings: number;
  violations: number;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface ShelfLocation {
  shelfLocationId: string;
  locationName: string;
  description: string;
  status: 'EMPTY' | 'OCCUPIED' | 'FULL';
  capacity: number;
  currentBooks: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookLocation {
  bookLocationId: string;
  bookId: string;
  book: Book;
  shelfLocationId: string;
  shelfLocation: ShelfLocation;
  createdAt: string;
}