import { useEffect, useState } from 'react'
import { borrowingsService } from '../services/borrowings'
import { Borrowing } from '../types/borrowing'
import { useAuth } from '../store/auth'

function Badge({ status }: { status: Borrowing['status'] }) {
  const map: Record<Borrowing['status'], string> = {
    'Chờ duyệt': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    'Đã duyệt': 'bg-blue-100 text-blue-600 border border-blue-300',
    'Đã trả': 'bg-green-100 text-green-600 border border-green-300',
    'Quá hạn': 'bg-red-100 text-red-600 border border-red-300',
    'Đã hủy': 'bg-gray-100 text-gray-600 border border-gray-300'
  }
  return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${map[status]}`}>{status}</span>
}

export default function MyBorrowings() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Borrowing[]>([])

  useEffect(() => {
    if (!user) return
    borrowingsService.getByEmail(user.email).then(setRows)
  }, [user])

  const summary = {
    total: rows.length,
    returned: rows.filter(l => l.status === 'Đã trả').length,
    borrowing: rows.filter(l => l.status === 'Đã duyệt' || l.status === 'Chờ duyệt').length,
    overdue: rows.filter(l => l.status === 'Quá hạn').length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Lịch sử mượn sách</h1>
        <p className="text-gray-500">Theo dõi tất cả các lần mượn sách của bạn</p>
      </div>

      <div className="grid grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="text-center"><div className="text-4xl font-bold">{summary.total}</div><div className="text-gray-500">Tổng lượt mượn</div></div>
        <div className="text-center"><div className="text-4xl font-bold">{summary.returned}</div><div className="text-gray-500">Đã trả</div></div>
        <div className="text-center"><div className="text-4xl font-bold">{summary.borrowing}</div><div className="text-gray-500">Đang mượn</div></div>
        <div className="text-center"><div className="text-4xl font-bold">{summary.overdue}</div><div className="text-gray-500">Quá hạn</div></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        {rows.map(loan => (
          <div key={loan.id}
               className={`p-4 rounded-lg flex justify-between items-center transition-shadow border ${
                 loan.status === 'Quá hạn' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:shadow-lg'
               }`}>
            <div>
              <p className="font-semibold text-lg">{loan.title}</p>
              <p className="text-sm text-gray-500">Mã sách: {loan.code}</p>
              <div className="flex items-center space-x-4 text-sm mt-2">
                <p className="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Ngày mượn: {loan.borrowDate}
                </p>
                <p className={`flex items-center ${loan.status === 'Quá hạn' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Hạn trả: {loan.dueDate}
                </p>
              </div>
            </div>
            <Badge status={loan.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
