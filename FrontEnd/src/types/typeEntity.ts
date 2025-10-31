// Dựa trên DTO/enum_data/AccountStatus.cs
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

// Dựa trên DTO/enum_data/BorrowingDetailStatus.cs
export enum BorrowingDetailStatus {
  PENDING = "PENDING",
  BORROWING = "BORROWING",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
  LOST = "LOST",
}

// Dựa trên DTO/enum_data/BorrowingStatus.cs
export enum BorrowingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  OVERDUE = "OVERDUE",
  COMPLETED = "COMPLETED",
}

// Dựa trên DTO/enum_data/ShelfStatus.cs
export enum ShelfStatus {
  EMPTY = "EMPTY",
  OCCUPIED = "OCCUPIED",
  FULL = "FULL",
}

// Dựa trên DTO/enum_data/StaffPosition.cs
export enum StaffPosition {
  LIBRARIAN = "LIBRARIAN",
  DIRECTOR = "DIRECTOR",
}

// Dựa trên DTO/response/users/AdminData.cs
export interface AdminData {
  staffCode: string; 
  position: string; 
}

// Dựa trên DTO/response/users/UserData.cs
export interface UserData {
  limitRenew: number | 3;
  countRenew: number | 0;
  limitBorrow: number | 5;
  countBorrow: number | 0;
  countViolations: number | 0;
}

// Dựa trên DTO/response/users/UserResponse.cs
export interface User {
  accountID: string; 
  role: string; 
  email: string;
  fullName: string;
  status: AccountStatus; 
  adminData: AdminData | null;
  userData: UserData | null;
  createdAt: string;
}

// Dựa trên DTO/response/library/books/BookResponse.cs
// Đổi tên thành 'Book' để dùng chung cho toàn bộ FE
export interface Book {
  bookID: number;
  isbn: string;
  title: string;
  author: string;
  categoryID: number;
  categoryName: string;
  publicationYear: number;
  totalQuantity: number;
  availableQuantity: number;
  description: string;
  publisher: string;
  coverImage: string;
  category: Category; 
}

// Dựa trên DTO/response/library/category/CategoryResponse.cs
export interface Category {
  categoryID: number;
  name: string;
  description?: string | null;
  // Thêm createdAt từ UI type cũ nếu cần, giả sử API có trả về
  createdAt?: string;
}

// Dựa trên DTO/response/library/shelf/ShelfResponse.cs
export interface ShelfLocation {
  shelfID: number;
  locationName: string;
  description?: string | null;
  status: ShelfStatus; 
  capacity: number;
  currentBooks?: number; 
  createdAt?: string;
  updatedAt?: string;
}

// Dựa trên DTO/response/borrowing/BorrowingDetailResponse.cs
export interface BorrowingDetailResponse {
  borrowingDetailID: number;
  bookID: number;
  bookTitle: string;
  quantityBook: number;
  dueDate: string; 
  returnDate?: string | null; 
  status: BorrowingDetailStatus; 
}

// Dựa trên DTO/response/borrowing/BorrowingResponse.cs
export interface BorrowingResponse {
  borrowingID: number;
  accountID: string; 
  staffID?: string | null; 
  borrowDate: string; 
  status: BorrowingStatus; 
  details: BorrowingDetailResponse[];
}

// Dựa trên models/DataAnalyticsDaily.cs
export interface DataAnalyticsDaily {
  dataAnalyticsID: number;
  reportDate: string; 
  countBorrowings: number;
  countUsersViolations: number;
  countUsersVisited: number;
  countUserBack: number;
  countBorrowingsToExpire: number;
  countBorrowingsRequestPending: number;
  createdAt: string;
  updatedAt: string;
}

// ======================================================
// ADDITIONAL FRONTEND ENTITIES (Không bị trùng lặp)
// ======================================================

// BookCopy cho UI
export interface BookCopy {
  copyId: string;
  barcode: string;
  status: 'AVAILABLE' | 'BORROWED' | 'DAMAGED';
}

// BorrowingSlip cho UI (Đã được chuẩn hóa)
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
  status: BorrowingStatus | BorrowingDetailStatus | string;
}

// BorrowingHistory cho UI
export interface BorrowingHistory {
  slipId: string;
  bookTitle: string;
  barcode: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowingStatus | BorrowingDetailStatus | string;
}

// DashboardSummary cho UI
export interface DashboardSummary {
  pendingRequests: number;
  borrowedToday: number;
  overdueBooks: number;
  activeUsers: number;
}

// WeeklyStats cho UI
export interface WeeklyStats {
  week: string;
  borrowings: number;
  violations: number;
}

// AuthResponse cho UI
export interface AuthResponse {
  user: User;
  token?: string;
}

// BookLocation cho UI
export interface BookLocation {
  bookLocationId: string;
  bookId: string; 
  book: Book;
  shelfLocationId: string; 
  shelfLocation: ShelfLocation;
  createdAt: string;
}