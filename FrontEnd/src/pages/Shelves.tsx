// src/pages/Shelves.tsx
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { shelvesService } from '../services/shelves'
import { Shelf } from '../types/shelf'
import { useAuth } from '../store/auth'

type Mode = 'create' | 'edit' | null

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-left">
      <div className="text-3xl font-bold text-black">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  )
}
function ProgressBar({ percent }: { percent: number }) {
  const p = Math.min(100, Math.max(0, percent))
  const bg = p >= 100 ? 'bg-red-500' : 'bg-yellow-500'
  return (
    <div className="w-40 h-2 rounded-full bg-gray-200">
      <div className={`h-2 rounded-full ${bg}`} style={{ width: `${p}%` }} />
    </div>
  )
}
function StatusBadge({ status }: { status: Shelf['status'] }) {
  const map: Record<Shelf['status'], string> = {
    'Đang dùng': 'bg-green-100 text-green-700',
    'Trống': 'bg-gray-100 text-gray-700',
    'Đầy': 'bg-red-100 text-red-700'
  }
  return <span className={`px-2 py-1 text-xs rounded-full ${map[status]}`}>{status}</span>
}

export default function Shelves() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [all, setAll] = useState<Shelf[]>([])
  const [query, setQuery] = useState('')
  const [booksOf, setBooksOf] = useState<Shelf | null>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [editing, setEditing] = useState<Shelf | null>(null)

  // form
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState<number>(50)
  const [currentLoad, setCurrentLoad] = useState<number>(0)

  const load = async () => setAll(await shelvesService.getAll())
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.code ?? '').toLowerCase().includes(q) ||
      (s.description ?? '').toLowerCase().includes(q)
    )
  }, [all, query])

  const total = all.length
  const emptyCount = all.filter(s => s.status === 'Trống').length
  const fullCount = all.filter(s => s.status === 'Đầy').length

  // open modals (UI vẫn kiểm tra quyền để khỏi mở nhầm)
  const openCreate = () => {
    if (!isAdmin) { alert('Bạn không có quyền thêm kệ.'); return }
    setMode('create'); setEditing(null)
    setName(''); setCode(''); setDescription(''); setCapacity(50); setCurrentLoad(0)
  }
  const openEdit = (s: Shelf) => {
    if (!isAdmin) { alert('Bạn không có quyền sửa kệ.'); return }
    setMode('edit'); setEditing(s)
    setName(s.name); setCode(s.code ?? ''); setDescription(s.description ?? '')
    setCapacity(s.capacity); setCurrentLoad(s.currentLoad)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (mode === 'create') {
        await shelvesService.add({ name, code, description, capacity, currentLoad })
      } else if (mode === 'edit' && editing) {
        await shelvesService.update(editing.id, { name, code, description, capacity, currentLoad })
      }
      setMode(null)
      await load()
    } catch (err: any) {
      alert(err?.message === 'PERMISSION_DENIED' ? 'Bạn không có quyền thực hiện thao tác này.' : 'Có lỗi xảy ra.')
    }
  }

  const remove = async (id: number) => {
    if (!isAdmin) { alert('Bạn không có quyền xóa kệ.'); return }
    if (!confirm('Xóa kệ này?')) return
    try {
      await shelvesService.remove(id)
      await load()
    } catch (err: any) {
      alert(err?.message === 'PERMISSION_DENIED' ? 'Bạn không có quyền xóa kệ.' : 'Không thể xóa kệ.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý kệ sách</h1>
          <p className="text-gray-500">Quản lý vị trí và sắp xếp sách trong thư viện</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate}
                  className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
            <span className="text-lg leading-none">+</span> Thêm kệ mới
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard value={total} label="Tổng số kệ" />
        <StatCard value={emptyCount} label="Kệ trống" />
        <StatCard value={fullCount} label="Kệ đầy" />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
              placeholder="Tìm kiếm kệ theo tên, mã hoặc mô tả…"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3">Tên kệ</th>
                <th className="px-4 py-3">Mã kệ</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Sức chứa</th>
                <th className="px-4 py-3">Đang chứa</th>
                <th className="px-4 py-3">Tỷ lệ lấp đầy</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(s => {
                const percent = Math.round((s.currentLoad / s.capacity) * 100)
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.code ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.description ?? '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">{s.capacity}</td>
                    <td className="px-4 py-3">{s.currentLoad}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar percent={percent} />
                        <span className="text-gray-600 w-12">{percent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Xem sách trong kệ: AI cũng mở được */}
                        <button
                          title="Xem sách trong kệ"
                          onClick={() => setBooksOf(s)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                            <polyline points="10 2 10 18"/>
                          </svg>
                        </button>

                        {/* Admin-only actions */}
                        {isAdmin && (
                          <>
                            <button title="Sửa kệ" onClick={() => openEdit(s)}
                                    className="p-2 rounded-lg hover:bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                   viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                              </svg>
                            </button>
                            <button title="Xóa kệ" onClick={() => remove(s.id)}
                                    className="p-2 rounded-lg hover:bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                   viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xem sách */}
      {booksOf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg modal-content-scrollable">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-xl font-bold">Sách trong kệ: {booksOf.name}</h3>
              <button onClick={() => setBooksOf(null)} className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            {booksOf.books?.length ? (
              <div className="space-y-3">
                {booksOf.books.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-lg border flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-xs text-gray-500">{b.author} • {b.category}</div>
                    </div>
                    <div className="text-sm text-gray-600">SL: {b.quantity}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Kệ chưa có sách.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal thêm/sửa (admin) */}
      {mode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={submit} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold">{mode === 'create' ? 'Thêm kệ mới' : 'Sửa kệ'}</h3>
              <button onClick={() => setMode(null)} type="button" className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tên kệ</label>
                <input className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                       value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mã kệ</label>
                <input className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                       value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: Kệ A1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <input className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                       value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Sức chứa</label>
                  <input type="number" min={1}
                         className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                         value={capacity} onChange={(e) => setCapacity(+e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đang chứa</label>
                  <input type="number" min={0}
                         className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                         value={currentLoad} onChange={(e) => setCurrentLoad(+e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setMode(null)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Hủy</button>
              <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
                {mode === 'create' ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
