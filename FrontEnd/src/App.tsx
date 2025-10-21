import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Borrowings from './pages/Borrowings'
import Categories from '@/pages/Categories'
import MyBorrowings from '@/pages/MyBorrowings'
import AdminAnalytics from '@/pages/AdminAnalytics'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/my-borrowings" element={<MyBorrowings />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/borrowings" element={<Borrowings />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
