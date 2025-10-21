import { FormEvent, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/store/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Email hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl text-center">
        {/* Icon Library */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="w-12 h-12 mx-auto text-black mb-4">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <polyline points="10 2 10 18"/>
        </svg>
        <h2 className="text-3xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-gray-500 mb-6">Nhập thông tin để truy cập vào hệ thống thư viện</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <span className="spinner mr-2" /> : null}
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-black hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
