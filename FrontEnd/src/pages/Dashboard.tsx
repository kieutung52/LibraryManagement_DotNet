import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/auth'

function StatCard({ number, label, description }: { number: string; label: string; description?: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-center">
      <div className="text-4xl font-bold text-black">{number}</div>
      <p className="text-gray-500 mt-1">{label}</p>
      {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-3 mb-4 rounded-full bg-gray-100 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <polyline points="10 2 10 18"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Hệ thống quản lý thư viện</h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
          Nền tảng hiện đại để quản lý sách, mượn trả và theo dõi hoạt động của thư viện một cách hiệu quả
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/books')}
            className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Khám phá sách</span>
          </button>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Đăng ký ngay
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <FeatureCard title="Quản lý sách" description="Hệ thống danh mục sách phong phú phục vụ tìm kiếm thông minh" />
        <FeatureCard title="Người dùng" description="Quản lý thông tin người dùng và phân quyền truy cập" />
        <FeatureCard title="Mượn trả" description="Theo dõi lịch sử mượn trả và nhắc nhở hạn trả sách" />
        <FeatureCard title="Bảo mật" description="Hệ thống bảo mật cao với phân quyền chi tiết" />
      </div>

      {/* Stats */}
      <div className="text-center pt-8">
        <h2 className="text-3xl font-bold mb-2">Thống kê hệ thống</h2>
        <p className="text-gray-500 mb-10">Những con số ấn tượng về thư viện của chúng tôi</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard number="1,250+" label="Đầu sách" />
          <StatCard number="450+" label="Người dùng" />
          <StatCard number="2,800+" label="Lượt mượn" />
          <StatCard number="98%" label="Hài lòng" />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-100 p-12 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Bắt đầu sử dụng ngay hôm nay</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Tham gia cùng độc giả và khám phá hàng ngàn đầu sách chất lượng cao.
        </p>
        <button
          onClick={() => navigate('/books')}
          className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
        >
          Khám phá ngay
        </button>
      </div>
    </div>
  )
}
