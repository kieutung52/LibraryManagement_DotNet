import { useRoutes } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Books from '@/pages/Books'
import Borrowings from '@/pages/Borrowings'
import Categories from '@/pages/Categories'
import MyBorrowings from '@/pages/MyBorrowings'
import AdminAnalytics from '@/pages/AdminAnalytics'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

export default function AppRoutes() {
  return useRoutes([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      element: <ProtectedRoute />,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/books', element: <Books /> },
        { path: '/my-borrowings', element: <MyBorrowings /> }
      ]
    },
    {
      element: <AdminRoute />,
      children: [
        { path: '/borrowings', element: <Borrowings /> },
        { path: '/categories', element: <Categories /> },
        { path: '/admin-analytics', element: <AdminAnalytics /> }
      ]
    }
  ])
}
