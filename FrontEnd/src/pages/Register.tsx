import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/server/auth'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    setLoading(true)
    try {
      await authService.register({ name, email, password })
      setSuccess(`Đăng ký thành công cho ${name} (${email}). Bạn có thể đăng nhập ngay.`)
      setTimeout(() => navigate('/login', { replace: true }), 800)
    } catch (err: any) {
      setError(err?.message || 'Không thể đăng ký.')
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

        <h2 className="text-3xl font-bold mb-2">Đăng ký</h2>
        <p className="text-gray-500 mb-6">Tạo tài khoản mới để sử dụng hệ thống thư viện</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
              required
            />
          </div>
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
              placeholder="Nhập mật khẩu tối thiểu 6 ký tự"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Đăng ký
          </button>
        </form>

        <p className="mt-6 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-black hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
