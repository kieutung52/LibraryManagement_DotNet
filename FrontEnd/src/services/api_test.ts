import { 
  User, 
  Book, 
  Category, 
  BorrowingSlip, 
  BorrowingHistory, 
  DashboardSummary, 
  WeeklyStats, 
  AuthResponse,
  ShelfLocation,
  BookLocation
} from '../types';
import { 
  mockUsers, 
  mockBooks, 
  mockCategories, 
  mockBorrowingSlips, 
  mockBorrowingHistory,
  mockDashboardSummary,
  mockWeeklyStats,
  mockShelfLocations,
  mockBookLocations
} from './mockData_test';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay(1000);
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password') {
        return { user, token: 'mock-jwt-token' };
      }
      throw new Error('Invalid credentials');
    },
    
    register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
      await delay(1000);
      const newUser: User = {
        accountId: String(Date.now()),
        fullName,
        email,
        role: 'USER',
        status: 'ACTIVE',
        limitBorrow: 5,
        limitRenew: 2,
        countViolations: 0,
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return { user: newUser, token: 'mock-jwt-token' };
    },
    
    me: async (): Promise<User> => {
      await delay(500);
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        return JSON.parse(currentUser);
      }
      throw new Error('Not authenticated');
    }
  },

  // Books endpoints
  books: {
    getAll: async (params?: { search?: string; categoryId?: string; page?: number; pageSize?: number }): Promise<{ books: Book[]; total: number }> => {
      await delay(800);
      let filteredBooks = [...mockBooks];
      
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(search) || 
          book.author.toLowerCase().includes(search)
        );
      }
      
      if (params?.categoryId) {
        filteredBooks = filteredBooks.filter(book => book.categoryId === params.categoryId);
      }
      
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        books: filteredBooks.slice(start, end),
        total: filteredBooks.length
      };
    },
    
    getById: async (id: string): Promise<Book> => {
      await delay(500);
      const book = mockBooks.find(b => b.bookId === id);
      if (!book) throw new Error('Book not found');
      return book;
    },

    create: async (bookData: Omit<Book, 'bookId' | 'category'>): Promise<Book> => {
      await delay(800);
      const category = mockCategories.find(c => c.categoryId === bookData.categoryId);
      if (!category) throw new Error('Category not found');
      
      const newBook: Book = {
        ...bookData,
        bookId: String(Date.now()),
        category
      };
      mockBooks.push(newBook);
      return newBook;
    },

    update: async (id: string, bookData: Partial<Omit<Book, 'bookId' | 'category'>>): Promise<Book> => {
      await delay(800);
      const bookIndex = mockBooks.findIndex(b => b.bookId === id);
      if (bookIndex === -1) throw new Error('Book not found');
      
      if (bookData.categoryId) {
        const category = mockCategories.find(c => c.categoryId === bookData.categoryId);
        if (!category) throw new Error('Category not found');
        mockBooks[bookIndex] = { ...mockBooks[bookIndex], ...bookData, category };
      } else {
        mockBooks[bookIndex] = { ...mockBooks[bookIndex], ...bookData };
      }
      
      return mockBooks[bookIndex];
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await delay(500);
      const bookIndex = mockBooks.findIndex(b => b.bookId === id);
      if (bookIndex === -1) throw new Error('Book not found');
      
      mockBooks.splice(bookIndex, 1);
      return { success: true };
    }
  },

  // Categories endpoints
  categories: {
    getAll: async (): Promise<Category[]> => {
      await delay(500);
      return mockCategories;
    },

    create: async (categoryData: Omit<Category, 'categoryId' | 'createdAt'>): Promise<Category> => {
      await delay(500);
      const newCategory: Category = {
        ...categoryData,
        categoryId: String(Date.now()),
        createdAt: new Date().toISOString()
      };
      mockCategories.push(newCategory);
      return newCategory;
    },

    update: async (id: string, categoryData: Partial<Omit<Category, 'categoryId' | 'createdAt'>>): Promise<Category> => {
      await delay(500);
      const categoryIndex = mockCategories.findIndex(c => c.categoryId === id);
      if (categoryIndex === -1) throw new Error('Category not found');
      
      mockCategories[categoryIndex] = { ...mockCategories[categoryIndex], ...categoryData };
      return mockCategories[categoryIndex];
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await delay(500);
      const categoryIndex = mockCategories.findIndex(c => c.categoryId === id);
      if (categoryIndex === -1) throw new Error('Category not found');
      
      // Check if any books are using this category
      const booksUsingCategory = mockBooks.filter(b => b.categoryId === id);
      if (booksUsingCategory.length > 0) {
        throw new Error('Cannot delete category that is being used by books');
      }
      
      mockCategories.splice(categoryIndex, 1);
      return { success: true };
    }
  },

  // Users endpoints (Admin only)
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(800);
      return mockUsers;
    },
    
    create: async (userData: Omit<User, 'accountId' | 'createdAt'>): Promise<User> => {
      await delay(800);
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }
      
      const newUser: User = {
        ...userData,
        accountId: String(Date.now()),
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    },

    update: async (id: string, userData: Partial<Omit<User, 'accountId' | 'createdAt'>>): Promise<User> => {
      await delay(800);
      const userIndex = mockUsers.findIndex(u => u.accountId === id);
      if (userIndex === -1) throw new Error('Không tìm thấy người dùng');
      
      // Check if email is being changed and already exists
      if (userData.email && userData.email !== mockUsers[userIndex].email) {
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          throw new Error('Email đã được sử dụng');
        }
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return mockUsers[userIndex];
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await delay(500);
      const userIndex = mockUsers.findIndex(u => u.accountId === id);
      if (userIndex === -1) throw new Error('Không tìm thấy người dùng');
      
      const user = mockUsers[userIndex];
      if (user.role === 'ADMIN') {
        throw new Error('Không thể xóa tài khoản quản trị viên');
      }
      
      mockUsers.splice(userIndex, 1);
      return { success: true };
    },
    
    updateStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> => {
      await delay(500);
      const user = mockUsers.find(u => u.accountId === id);
      if (!user) throw new Error('User not found');
      user.status = status;
      return user;
    }
  },

  // Borrowings endpoints
  borrowings: {
    request: async (bookIds: string[]): Promise<{ success: boolean }> => {
      await delay(1000);
      return { success: true };
    },
    
    myHistory: async (): Promise<BorrowingHistory[]> => {
      await delay(500);
      return mockBorrowingHistory;
    },
    
    getAll: async (status?: string): Promise<BorrowingSlip[]> => {
      await delay(800);
      let filteredSlips = [...mockBorrowingSlips];
      if (status) {
        filteredSlips = filteredSlips.filter(slip => slip.status === status);
      }
      return filteredSlips;
    },
    
    approve: async (id: string): Promise<{ success: boolean }> => {
      await delay(500);
      const slip = mockBorrowingSlips.find(s => s.slipId === id);
      if (slip) {
        slip.status = 'APPROVED';
      }
      return { success: true };
    },
    
    returnBook: async (barcode: string): Promise<{ success: boolean }> => {
      await delay(500);
      return { success: true };
    }
  },

  // Reports endpoints (Admin only)
  reports: {
    getDashboardSummary: async (): Promise<DashboardSummary> => {
      await delay(500);
      return mockDashboardSummary;
    },
    
    getWeeklyStats: async (): Promise<WeeklyStats[]> => {
      await delay(500);
      return mockWeeklyStats;
    }
  },

  // Shelf Locations endpoints (Admin only)
  shelfLocations: {
    getAll: async (): Promise<ShelfLocation[]> => {
      await delay(800);
      return mockShelfLocations;
    },

    getById: async (id: string): Promise<ShelfLocation> => {
      await delay(500);
      const shelf = mockShelfLocations.find(s => s.shelfLocationId === id);
      if (!shelf) throw new Error('Không tìm thấy kệ sách');
      return shelf;
    },

    create: async (shelfData: Omit<ShelfLocation, 'shelfLocationId' | 'createdAt' | 'updatedAt' | 'currentBooks'>): Promise<ShelfLocation> => {
      await delay(800);
      const existingShelf = mockShelfLocations.find(s => s.locationName === shelfData.locationName);
      if (existingShelf) {
        throw new Error('Tên kệ đã tồn tại');
      }

      const newShelf: ShelfLocation = {
        ...shelfData,
        shelfLocationId: String(Date.now()),
        currentBooks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockShelfLocations.push(newShelf);
      return newShelf;
    },

    update: async (id: string, shelfData: Partial<Omit<ShelfLocation, 'shelfLocationId' | 'createdAt' | 'updatedAt' | 'currentBooks'>>): Promise<ShelfLocation> => {
      await delay(800);
      const shelfIndex = mockShelfLocations.findIndex(s => s.shelfLocationId === id);
      if (shelfIndex === -1) throw new Error('Không tìm thấy kệ sách');

      if (shelfData.locationName && shelfData.locationName !== mockShelfLocations[shelfIndex].locationName) {
        const existingShelf = mockShelfLocations.find(s => s.locationName === shelfData.locationName);
        if (existingShelf) {
          throw new Error('Tên kệ đã tồn tại');
        }
      }

      mockShelfLocations[shelfIndex] = {
        ...mockShelfLocations[shelfIndex],
        ...shelfData,
        updatedAt: new Date().toISOString()
      };
      return mockShelfLocations[shelfIndex];
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await delay(500);
      const shelfIndex = mockShelfLocations.findIndex(s => s.shelfLocationId === id);
      if (shelfIndex === -1) throw new Error('Không tìm thấy kệ sách');

      const booksOnShelf = mockBookLocations.filter(bl => bl.shelfLocationId === id);
      if (booksOnShelf.length > 0) {
        throw new Error('Không thể xóa kệ có chứa sách. Vui lòng xóa hết sách trước.');
      }

      mockShelfLocations.splice(shelfIndex, 1);
      return { success: true };
    },

    getBooksByShelf: async (shelfId: string): Promise<BookLocation[]> => {
      await delay(500);
      const shelf = mockShelfLocations.find(s => s.shelfLocationId === shelfId);
      if (!shelf) throw new Error('Không tìm thấy kệ sách');
      
      return mockBookLocations.filter(bl => bl.shelfLocationId === shelfId);
    },

    addBookToShelf: async (shelfId: string, bookId: string): Promise<BookLocation> => {
      await delay(800);
      const shelf = mockShelfLocations.find(s => s.shelfLocationId === shelfId);
      if (!shelf) throw new Error('Không tìm thấy kệ sách');

      const book = mockBooks.find(b => b.bookId === bookId);
      if (!book) throw new Error('Không tìm thấy sách');

      const existingLocation = mockBookLocations.find(
        bl => bl.bookId === bookId && bl.shelfLocationId === shelfId
      );
      if (existingLocation) {
        throw new Error('Sách đã có trên kệ này');
      }

      if (shelf.currentBooks >= shelf.capacity) {
        throw new Error('Kệ đã đầy. Không thể thêm sách.');
      }

      const newBookLocation: BookLocation = {
        bookLocationId: String(Date.now()),
        bookId,
        book,
        shelfLocationId: shelfId,
        shelfLocation: shelf,
        createdAt: new Date().toISOString()
      };

      mockBookLocations.push(newBookLocation);
      
      // Update shelf current books count and status
      shelf.currentBooks += 1;
      if (shelf.currentBooks >= shelf.capacity) {
        shelf.status = 'FULL';
      } else if (shelf.currentBooks > 0) {
        shelf.status = 'OCCUPIED';
      }
      shelf.updatedAt = new Date().toISOString();

      return newBookLocation;
    },

    removeBookFromShelf: async (bookLocationId: string): Promise<{ success: boolean }> => {
      await delay(500);
      const locationIndex = mockBookLocations.findIndex(bl => bl.bookLocationId === bookLocationId);
      if (locationIndex === -1) throw new Error('Không tìm thấy vị trí sách');

      const bookLocation = mockBookLocations[locationIndex];
      const shelf = mockShelfLocations.find(s => s.shelfLocationId === bookLocation.shelfLocationId);
      
      if (shelf) {
        shelf.currentBooks = Math.max(0, shelf.currentBooks - 1);
        if (shelf.currentBooks === 0) {
          shelf.status = 'EMPTY';
        } else if (shelf.currentBooks < shelf.capacity) {
          shelf.status = 'OCCUPIED';
        }
        shelf.updatedAt = new Date().toISOString();
      }

      mockBookLocations.splice(locationIndex, 1);
      return { success: true };
    }
  }
};

// Service wrappers for easier usage
export const bookService = {
  getAll: () => api.books.getAll().then(res => ({ data: res.books, total: res.total })),
  getById: (id: string) => api.books.getById(id),
  create: (data: any) => api.books.create(data),
  update: (id: string, data: any) => api.books.update(id, data),
  delete: (id: string) => api.books.delete(id)
};

export const categoryService = {
  getAll: () => api.categories.getAll().then(data => ({ data })),
  create: (data: any) => api.categories.create(data),
  update: (id: string, data: any) => api.categories.update(id, data),
  delete: (id: string) => api.categories.delete(id)
};