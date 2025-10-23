import { useEffect, useMemo, useState, FormEvent } from 'react'
import { booksService } from '../services/books'
import { categoriesService } from '../services/categories'
import { Book } from '../types/book'
import { useAuth } from '../store/auth'

/* ---------- Detail view ---------- */
function DetailView({ book, onBack }: { book: Book; onBack: () => void }) {
  const isAvailable = book.available > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Quay lại
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{book.title}</h1>
      </div>
      <p className="text-gray-500 mb-6">Chi tiết thông tin sách</p>

      {/* 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-900"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a.5.5 0 0 1 0-5H20"/>
              <polyline points="10 2 10 18"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Thông tin sách</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            <div className="py-3 border-b">
              <div className="text-sm text-gray-500 mb-1">Tên sách</div>
              <div className="font-semibold text-gray-900">{book.title}</div>
            </div>
            <div className="py-3 border-b">
              <div className="text-sm text-gray-500 mb-1">Tác giả</div>
              <div className="font-semibold text-gray-900">{book.author}</div>
            </div>

            <div className="py-3 border-b">
              <div className="text-sm text-gray-500 mb-1">Năm xuất bản</div>
              <div className="flex items-center gap-2 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M3 10h18"/>
                </svg>
                {book.year}
              </div>
            </div>
            <div className="py-3 border-b">
              <div className="text-sm text-gray-500 mb-1">ISBN</div>
              <div className="flex items-center gap-2 text-gray-900">
                <span className="font-mono">#</span> {book.code}
              </div>
            </div>

            <div className="py-3">
              <div className="text-sm text-gray-500 mb-1">Danh mục</div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19V5a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                </svg>
                <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {book.description || 'Sách thuộc danh mục liên quan.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: status card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-max">
          <div className="text-gray-900 font-semibold mb-4">Tình trạng</div>

          <div className="space-y-4 mb-6">
            <div className="rounded-2xl bg-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-gray-700">{book.available}</div>
              <div className="text-sm text-gray-500 mt-1">Số sách có sẵn</div>
            </div>
            <div className="rounded-2xl bg-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-gray-700">{book.stock}</div>
              <div className="text-sm text-gray-500 mt-1">Tổng số sách</div>
            </div>
          </div>

          <button
            disabled={!isAvailable}
            onClick={() => alert(`Yêu cầu mượn sách: ${book.title}`)}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isAvailable ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Mượn sách này
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Card in list ---------- */
function BookCard({ book, onDetail }: { book: Book; onDetail: () => void }) {
  const isAvailable = book.available > 0
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        <p className="text-sm text-gray-400 mb-4">{book.year}</p>
        <div className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {book.category}
        </div>
      </div>
      <div className="pt-4 border-t border-dashed border-gray-200">
        <p className={`text-sm font-medium mb-3 ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
          Còn lại: {book.available}/{book.stock}
        </p>
        <button
          onClick={onDetail}
          className="w-full text-center py-2 rounded-lg font-medium bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  )
}

/* ---------- Create modal (admin only) ---------- */
function CreateBookModal({
  open,
  onClose,
  onCreated,
  categories
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
  categories: string[]
}) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [category, setCategory] = useState('')
  const [publisher, setPublisher] = useState('')
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [stock, setStock] = useState<number>(1)
  const [available, setAvailable] = useState<number>(1)
  const [coverUrl, setCoverUrl] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      // reset form every time open
      setTitle(''); setAuthor(''); setIsbn(''); setCategory('');
      setPublisher(''); setYear(new Date().getFullYear());
      setStock(1); setAvailable(1); setCoverUrl(''); setDescription('');
    }
  }, [open])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim() || !isbn.trim() || !category.trim()) {
      alert('Vui lòng nhập đủ Tên sách, Tác giả, ISBN và Danh mục.')
      return
    }
    if (available > stock) {
      alert('Số bản có sẵn không được lớn hơn tổng số bản.')
      return
    }
    setSaving(true)
    try {
      // Map form -> Book (dùng code làm ISBN, các trường bổ sung bỏ vào description)
      const note =
        description ||
        (publisher || coverUrl
          ? `NXB: ${publisher || '-'}${coverUrl ? ` | Ảnh bìa: ${coverUrl}` : ''}`
          : '')
      await booksService.add({
        title,
        author,
        year,
        stock,
        available,
        category,
        code: isbn,
        description: note
      })
      onCreated()
      onClose()
    } catch (err: any) {
      alert(err?.message || 'Không thể thêm sách.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
        <form onSubmit={submit}
        className="w-full max-w-2xl bg-white p-6 md:p-7 overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Thêm sách mới</h3>
            <p className="text-sm text-gray-500">Thêm sách mới vào thư viện</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên sách *</label>
            <input className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tác giả *</label>
            <input className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={author} onChange={e => setAuthor(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ISBN *</label>
            <input className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={isbn} onChange={e => setIsbn(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục *</label>
            <div className="relative">
              <select
                className="w-full appearance-none p-3 pr-10 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="" disabled>Chọn danh mục</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhà xuất bản</label>
            <input className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={publisher} onChange={e => setPublisher(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Năm xuất bản</label>
            <input type="number" className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={year} onChange={e => setYear(+e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tổng số bản</label>
            <input type="number" min={1} className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={stock} onChange={e => setStock(+e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số bản có sẵn</label>
            <input type="number" min={0} className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   value={available} onChange={e => setAvailable(+e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">URL ảnh bìa</label>
            <input className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                   placeholder="https://example.com/cover.jpg"
                   value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea rows={3} className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
                      value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Hủy</button>
          <button disabled={saving}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
            {saving ? 'Đang lưu…' : 'Thêm sách'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Page ---------- */
export default function Books() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [books, setBooks] = useState<Book[]>([])
  const [selected, setSelected] = useState<Book | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục')
  const [categories, setCategories] = useState<string[]>([])
  const [showCreate, setShowCreate] = useState(false)

  const load = async () => {
    const bs = await booksService.getAll()
    setBooks(bs)
  }

  useEffect(() => {
    load()
    categoriesService.getAll().then((cats) => {
      setCategories(cats.map(c => c.name))
    })
  }, [])

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchCat = filterCategory === 'Tất cả danh mục' || b.category === filterCategory
      const matchSearch = !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        (b.code || '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [books, filterCategory, search])

  // Detail view
  if (selected) {
    return <DetailView book={selected} onBack={() => setSelected(null)} />
  }

  // List view
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header + add button (admin-only) */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý sách</h1>
          <p className="text-gray-500">Quản lý toàn bộ sách trong thư viện</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
          >
            <span className="text-lg leading-none">+</span> Thêm sách mới
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách, tác giả hoặc ISBN"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
            />
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none p-3 pr-10 border border-gray-300 rounded-lg bg-gray-100 focus:ring-black focus:border-black transition"
            >
              <option>Tất cả danh mục</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length ? (
          filtered.map(b => (
            <BookCard key={b.id} book={b} onDetail={() => setSelected(b)} />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500 p-10 bg-white rounded-xl">
            Không tìm thấy sách phù hợp.
          </p>
        )}
      </div>

      {/* Modal create (admin only) */}
      <CreateBookModal
        open={isAdmin && showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={load}
        categories={categories}
      />
    </div>
  )
}
