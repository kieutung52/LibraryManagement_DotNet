// Import các enum cần thiết từ typeEntity
import { AccountStatus, BorrowingStatus } from './typeEntity';

// Dựa trên DTO/request/users/LoginRequest.cs [cite: 130, 131]
export interface LoginRequest {
  email: string;
  password: string;
}

// Dựa trên DTO/request/users/RegisterRequest.cs [cite: 127-129]
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

// Dựa trên DTO/request/users/CreateUserRequest.cs [cite: 122, 123]
export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
}

// Dựa trên DTO/request/users/UpdateUserRequest.cs [cite: 124-126]
export interface UpdateUserRequest {
  fullName: string;
  role: string;
  email: string;
  status?: string | null;
  adminData?: { 
    staffCode?: string;
    position?: string;
  } | null;
  userData?: {
    limitBorrow?: number;
    limitRenew?: number;
    countViolations?: number;
  } | null;
}

// Dựa trên DTO/request/library/books/CreateBookRequest.cs [cite: 132-136]
export interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  categoryID?: number | null;
  publicationYear?: number | null;
  totalQuantity: number;
  description?: string | null;
  publisher?: string | null;
  coverImage?: string | null;
}

// Dựa trên DTO/request/library/books/UpdateBookRequest.cs [cite: 137-141]
export interface UpdateBookRequest {
  title: string;
  author: string;
  categoryID?: number | null;
  publicationYear?: number | null;
  totalQuantity: number;
  availableQuantity: number;
  description?: string | null;
  publisher?: string | null;
  coverImage?: string | null;
}

// Dựa trên DTO/request/library/category/CreateCategoryRequest.cs [cite: 144, 145]
export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

// Dựa trên DTO/request/library/category/UpdateCategoryRequest.cs [cite: 142, 143]
export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
}

// Dựa trên DTO/request/library/shelf/CreateShelfRequest.cs [cite: 150-152]
export interface CreateShelfRequest {
  locationName: string;
  description?: string | null;
  capacity: number;
}

// Dựa trên DTO/request/library/shelf/UpdateShelfRequest.cs [cite: 146, 147]
export interface UpdateShelfRequest {
  locationName: string;
  description?: string | null;
  status: string;
  capacity: number;
}

// Dựa trên DTO/request/library/shelf/AddBookToShelfRequest.cs [cite: 148, 149]
export interface AddBookToShelfRequest {
  bookID: number;
  shelfID: number;
}

// Dựa trên DTO/request/borrowing/CreateBorrowingRequest.cs (class con) [cite: 116-118]
export interface BorrowingBookRequest {
  bookID: number;
  quantity: number;
}

// Dựa trên DTO/request/borrowing/CreateBorrowingRequest.cs (class chính) [cite: 114, 115]
export interface CreateBorrowingRequest {
  accountID: string; 
  books: BorrowingBookRequest[];
}

// Dựa trên DTO/request/borrowing/RenewBorrowingRequest.cs [cite: 119]
export interface RenewBorrowingRequest {
  borrowingID: number;
  borrowingDetailID: number;
}

// Dựa trên DTO/request/borrowing/ReturnBookRequest.cs [cite: 112, 113]
export interface ReturnBookRequest {
  borrowingDetailId: number;
  isbn: string;
}

// Dựa trên DTO/request/borrowing/UpdateBorrowingRequest.cs [cite: 120, 121]
export interface UpdateBorrowingRequest {
  status: string | null;
  staffID?: string | null; 
}