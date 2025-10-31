import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/sonner';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Books } from './pages/Books';
import { BookDetail } from './pages/BookDetail';
import { Categories } from './pages/Categories';
import { BorrowRequest } from './pages/BorrowRequest';
import { MyHistory } from './pages/MyHistory';

// Admin Pages
import { AdminUsers } from './pages/admin/Users';
import { AdminBorrowings } from './pages/admin/Borrowings';
import { AdminReports } from './pages/admin/Reports';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminShelfLocations } from './pages/admin/ShelfLocations';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/categories" element={<Categories />} />
              
              {/* Protected User Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/borrowings/request" element={<BorrowRequest />} />
              <Route path="/borrowings/my-history" element={<MyHistory />} />
              <Route path="/my-borrowings" element={<MyHistory />} />
              
              {/* Admin Routes */}
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin-analytics" element={<AdminReports />} />
              <Route path="/admin/books" element={<AdminBooks />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/shelves" element={<AdminShelfLocations />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/user" element={<AdminUsers />} />
              <Route path="/admin/borrowings" element={<AdminBorrowings />} />
              <Route path="/borrowings" element={<AdminBorrowings />} />
              
              {/* Catch all routes - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #e5e7eb',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}