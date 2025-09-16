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
    Title NVARCHAR(255) NOT NULL,
    Author NVARCHAR(255) NOT NULL,
    CategoryID INT,
    PublicationYear INT,
    TotalQuantity INT NOT NULL CHECK (TotalQuantity >= 0),
    AvailableQuantity INT NOT NULL CHECK (AvailableQuantity >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL
);

-- =============================================
-- Table: Accounts
-- Description: Stores user and admin account information.
-- =============================================
CREATE TABLE Accounts (
    AccountID INT AUTO_INCREMENT PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    Status ENUM('ACTIVE', 'SUSPENDED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    EmployeeID VARCHAR(20) NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    AdminID INT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES Accounts(AccountID) ON DELETE SET NULL
);

-- =============================================
-- Table: BorrowingDetails
-- Description: Stores details of each book within a borrowing transaction.
-- =============================================
CREATE TABLE BorrowingDetails (
    BorrowingDetailID INT AUTO_INCREMENT PRIMARY KEY,
    BorrowingID INT NOT NULL,
    BookID INT NOT NULL,
    DueDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Status ENUM('BORROWING', 'RETURNED', 'OVERDUE', 'LOST') NOT NULL DEFAULT 'BORROWING',
    
    FOREIGN KEY (BorrowingID) REFERENCES Borrowings(BorrowingID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

-- =============================================
-- Seeding initial data
-- =============================================

INSERT INTO Categories (Name, Description) VALUES
('Science Fiction', 'Books that explore futuristic concepts and advanced technology.'),
('Fantasy', 'Books that contain magical or supernatural elements.'),
('Non-Fiction', 'Informative books based on facts and real events.');

INSERT INTO Books (Title, Author, CategoryID, PublicationYear, TotalQuantity, AvailableQuantity) VALUES
('Dune', 'Frank Herbert', 1, 1965, 10, 10),
('The Hobbit', 'J.R.R. Tolkien', 2, 1937, 5, 5),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 3, 2011, 8, 8);