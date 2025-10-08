CREATE DATABASE IF NOT EXISTS LibraryManagement;
USE LibraryManagement;

-- =============================================
-- Table: Categories
-- Description: Stores book categories.
-- =============================================
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description TEXT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Table: Books
-- Description: Stores information about each book title.
-- =============================================
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    ISBN NVARCHAR(100) NOT NULL UNIQUE,
    Title NVARCHAR(255) NOT NULL,
    Author NVARCHAR(255) NOT NULL,
    CategoryID INT,
    PublicationYear INT,
    TotalQuantity INT NOT NULL CHECK (TotalQuantity >= 0),
    AvailableQuantity INT NOT NULL CHECK (AvailableQuantity >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    BorrowedCount INT NOT NULL DEFAULT 0,

    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL
);

-- =============================================
-- Table: ShelfLocations
-- Description: Stores information about shelf locations in the library.
-- =============================================
CREATE TABLE Shelf (
    ShelfID INT AUTO_INCREMENT PRIMARY KEY,
    LocationName NVARCHAR(100) NOT NULL UNIQUE,
    Description TEXT NULL,
    Status ENUM("EMPTY","OCCUPIED","FULL") NOT NULL DEFAULT "EMPTY",
    Capacity INT NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Table: BookLocations
-- Description: Maps books to their shelf locations and tracks quantities at each location.
-- =============================================
CREATE TABLE BookLocation (
    BookLocationID INT AUTO_INCREMENT PRIMARY KEY,
    BookID INT NOT NULL,
    ShelfLocationID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    FOREIGN KEY (ShelfLocationID) REFERENCES ShelfLocations(ShelfLocationID) ON DELETE CASCADE
);

-- =============================================
-- Table: Accounts
-- Description: Stores user and admin account information.
-- =============================================
-- Using single table with 3 table: Account, User, Admin as Column 'Role' modelBuilder.Entity<Account>().HasDiscriminator<string>("Role").HasValue<User>("USER").HasValue<Admin>("ADMIN");
CREATE TABLE Accounts (
    AccountID INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Discriminator Column (Cột phân biệt)
    Role VARCHAR(10) NOT NULL, -- EF Core sẽ dùng cột này để biết là 'USER' hay 'ADMIN'

    -- Common Columns (Các cột chung)
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Status ENUM('ACTIVE', 'SUSPENDED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- User-Specific Columns (Các cột của User, sẽ NULL nếu là Admin)
    LimitRenew INT NULL,
    CountRenew INT NULL,
    LimitBorrow INT NULL,
    CountBorrow INT NULL,
    CountViolations INT NULL,

    -- Admin-Specific Columns (Các cột của Admin, sẽ NULL nếu là User)
    StaffID VARCHAR(255) NULL,
    Position ENUM("LIBRARIAN", "DIRECTOR") NULL
);

-- =============================================
-- Table: Borrowings
-- Description: Represents a single borrowing transaction (a borrowing slip).
-- =============================================
CREATE TABLE Borrowings (
    BorrowingID INT AUTO_INCREMENT PRIMARY KEY,
    AccountID INT NOT NULL,
    BorrowDate DATE NOT NULL,
    Status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    StaffID VARCHAR(255) NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE,
    FOREIGN KEY (StaffID) REFERENCES Accounts(AccountID) ON DELETE SET NULL
);

-- =============================================
-- Table: BorrowingDetails
-- Description: Stores details of each book within a borrowing transaction.
-- =============================================
CREATE TABLE BorrowingDetails (
    BorrowingDetailID INT AUTO_INCREMENT PRIMARY KEY,
    BorrowingID INT NOT NULL,
    BookID INT NOT NULL,
    QuantityBook INT NOT NULL CHECK (Quantity > 0),
    DueDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Status ENUM('BORROWING', 'RETURNED', 'OVERDUE', 'LOST') NOT NULL DEFAULT 'BORROWING',
    
    FOREIGN KEY (BorrowingID) REFERENCES Borrowings(BorrowingID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

-- =============================================
-- Table: DataAnalytics
-- Description: Placeholder for future data analytics features.
-- =============================================
CREATE TABLE DataAnalyticsDaily (
    DataAnalyticsID INT AUTO_INCREMENT PRIMARY KEY,
    ReportDate DATE NOT NULL,
    CountBorrowings INT NOT NULL DEFAULT 0,
    CountUsersVisolations INT NOT NULL DEFAULT 0, -- dem so nguoi dung vi pham quy dinh
    CountUsersVisted INT NOT NULL DEFAULT 0, -- dem so nguoi dung truy cap he thong
    CountUserBack INT NOT NULL DEFAULT 0, -- dem so nguoi dung da dang ki tai khoan va login(Quay lai su dung)
    CountBorrowingsToExpire INT NOT NULL DEFAULT 0, -- dem so luong sach sap het han tra
    CountBorrowingsRequestPending INT NOT NULL DEFAULT 0, -- dem so luong phieu muon dang cho duyet
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);