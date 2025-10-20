import { useEffect, useMemo, useState } from 'react'
import { borrowingsService } from '../services/borrowings'
import { Borrowing } from '../types/borrowing'
import DataTable from '../components/DataTable'

export default function Borrowings() {
  const [rows, setRows] = useState<Borrowing[]>([])
  const [filter, setFilter] = useState<'Tất cả' | Borrowing['status']>('Tất cả')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await borrowingsService.getAll()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (filter === 'Tất cả') return rows
    return rows.filter(r => r.status === filter)
  }, [rows, filter])

  const update = async (id: number, status: Borrowing['status']) => {
    await borrowingsService.updateStatus(id, status)
    load()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý mượn sách</h1>
        <p className="text-gray-500">Xem xét và xử lý các yêu cầu mượn trả sách</p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="appearance-none p-3 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-black focus:border-black transition"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Đã trả">Đã trả</option>
          <option value="Quá hạn">Quá hạn</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600"><span className="spinner"/> Đang tải…</div>
      ) : (
        <DataTable
          data={filtered}
          columns={[
            { key: 'user', header: 'Người mượn' },
            { key: 'email', header: 'Email' },
            { key: 'title', header: 'Sách' },
            { key: 'code', header: 'Mã sách' },
            { key: 'borrowDate', header: 'Ngày mượn' },
            { key: 'dueDate', header: 'Hạn trả' },
            { key: 'status', header: 'Trạng thái' },
            {
              key: 'actions',
              header: 'Thao tác',
              render: (r) => (
                <div className="flex gap-2">
                  <button onClick={() => update(r.id, 'Đã duyệt')}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs">Duyệt</button>
                  <button onClick={() => update(r.id, 'Đã trả')}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs">Trả</button>
                  <button onClick={() => update(r.id, 'Đã hủy')}
                          className="px-3 py-1 rounded-lg bg-gray-300 text-gray-800 text-xs">Hủy</button>
                </div>
              )
            }
          ]}
        />
      )}
    </div>
  )
}
