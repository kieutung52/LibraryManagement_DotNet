import { FormEvent, useEffect, useMemo, useState } from 'react'
import { categoriesService } from '../services/categories'
import { Category } from '../types/category'
import { booksService } from '../services/books'
import { Book } from '../types/book'
import { useAuth } from '../store/auth'

/* --------- Small UI bits --------- */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
      {children}
    </span>
  )
}
function IconBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`p-2 rounded-lg hover:bg-gray-100 ${props.className || ''}`} />
  )
}

/* --------- Modal shell (max-w-2xl, backdrop full màn hình) --------- */
function Modal({
  open, title, children, onClose
}: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[1] flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-h-[90vh] overflow-y-auto p-6 md:p-7">
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="text-xl font-semibold">{title}</h3></div>
              <IconBtn onClick={onClose} aria-label="Đóng">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </IconBtn>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------- Modal: Thêm / Sửa danh mục --------- */
function UpsertCategoryModal({
  open, mode, initial, onClose, onSubmit
}: {
  open: boolean
  mode: 'create' | 'edit'
  initial?: Partial<Category>
  onClose: () => void
  onSubmit: (payload: { name: string; description: string }) => Promise<void>
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initial?.name || '')
      setDescription(initial?.description || '')
    }
  }, [open, initial])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'create' ? 'Thêm danh mục mới' : 'Sửa danh mục'}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
          <input
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
            placeholder="Ví dụ: Văn học, Khoa học…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
            placeholder="Mô tả ngắn về danh mục này…"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Hủy</button>
          <button disabled={saving}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
            {saving ? 'Đang lưu…' : (mode === 'create' ? 'Thêm danh mục' : 'Lưu')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* --------- Modal: Xem sách trong danh mục --------- */
function CategoryBooksModal({
  open, categoryName, books, onClose
}: { open: boolean; categoryName: string; books: Book[]; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={`Sách trong danh mục: ${categoryName}`}>
      {books.length ? (
        <div className="space-y-3">
          {books.map((b) => (
            <div key={b.id} className="p-3 rounded-lg border flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-semibold truncate">{b.title}</div>
                <div className="text-xs text-gray-500">{b.author} • {b.year} • ISBN: {b.code}</div>
              </div>
              <Badge>{b.available}/{b.stock} còn</Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Danh mục này chưa có sách.</p>
      )}
    </Modal>
  )
}

/* --------- Modal: Thêm sách vào danh mục (admin) --------- */
function AddBookToCategoryModal({
  open, category, onClose, onAdded
}: {
  open: boolean
  category: Category | null
  onClose: () => void
  onAdded: () => void
}) {
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    if (open) {
      booksService.getAll().then(setAllBooks)
      setQuery('')
      setShowList(false)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allBooks
    return allBooks.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.code || '').toLowerCase().includes(q)
    )
  }, [allBooks, query])

  const attach = async (book: Book) => {
    if (!category) return
    if ((book.category || '').toLowerCase() === category.name.toLowerCase()) {
      alert('Sách đã thuộc danh mục này.')
      return
    }
    try {
      // Ưu tiên dùng booksService.update nếu có
      const svc: any = booksService as any
      if (typeof svc.update === 'function') {
        await svc.update(book.id, { category: category.name })
      } else {
        alert('Service books chưa hỗ trợ update(). Vui lòng thêm booksService.update để gán danh mục.')
        return
      }
      onAdded()
      onClose()
    } catch (e: any) {
      alert(e?.message || 'Không thể thêm sách vào danh mục.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Thêm sách vào: ${category?.name || ''}`}>
      {/* Textbox có mũi tên để xổ danh sách */}
      <div className="relative mb-4">
        <input
          className="w-full p-3 pr-10 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
          placeholder="Tìm theo tên, tác giả hoặc ISBN…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowList(true)}
        />
        <button
          type="button"
          onClick={() => setShowList(v => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-200"
          aria-label="Mở danh sách sách"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Danh sách xổ (đầy đủ thông tin) */}
      {showList && (
        <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
          {filtered.map(b => (
            <button
              key={b.id}
              onClick={() => attach(b)}
              className="w-full text-left p-3 hover:bg-gray-50"
              title="Bấm để thêm sách này vào danh mục"
            >
              <div className="font-semibold">{b.title}</div>
              <div className="text-xs text-gray-500">
                {b.author} • {b.year} • ISBN: {b.code} • {b.available}/{b.stock} còn
              </div>
              {b.category && (
                <div className="text-[11px] text-gray-500 mt-1">
                  Danh mục hiện tại: <span className="font-medium">{b.category}</span>
                </div>
              )}
            </button>
          ))}
          {!filtered.length && (
            <div className="p-3 text-sm text-gray-500">Không có sách phù hợp.</div>
          )}
        </div>
      )}
    </Modal>
  )
}

/* =================== PAGE =================== */
export default function Categories() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [items, setItems] = useState<Category[]>([])
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [viewBooksOf, setViewBooksOf] = useState<Category | null>(null)

  // modal: thêm sách vào danh mục
  const [addInto, setAddInto] = useState<Category | null>(null)

  const load = async () => {
    const cats = await categoriesService.getAll()
    setItems(cats)
    try {
      const bs = await booksService.getAll()
      setBooks(bs)
    } catch { /* optional */ }
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    )
  }, [items, query])

  const add = async ({ name, description }: { name: string; description: string }) => {
    await categoriesService.add({ name, description })
    await load()
  }

  const edit = async ({ name, description }: { name: string; description: string }) => {
    const anySvc = categoriesService as any
    if (typeof anySvc.update !== 'function') {
      alert('Chưa hỗ trợ sửa danh mục ở service. Vui lòng bổ sung categoriesService.update().')
      return
    }
    await anySvc.update(editItem!.id, { name, description })
    await load()
  }

  const remove = async (id: number) => {
    if (!confirm('Xóa danh mục này?')) return
    try {
      await categoriesService.remove(id)
      await load()
    } catch (err: any) {
      alert(err?.message === 'PERMISSION_DENIED'
        ? 'Bạn không có quyền xóa danh mục.'
        : 'Không thể xóa danh mục.')
    }
  }

  const booksOfCategory = (name: string) =>
    books.filter(b => (b.category || '').toLowerCase() === name.toLowerCase())

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header + Add button (admin only) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-500">Quản lý các danh mục sách trong thư viện</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800">
            <span className="text-lg leading-none">+</span> Thêm danh mục mới
          </button>
        )}
      </div>

      {/* Bảng danh mục */}
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
              placeholder="Tìm kiếm danh mục..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3">Tên danh mục</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Số lượng sách</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-600">{cat.description}</td>
                  <td className="px-4 py-3"><Badge>{cat.bookCount ?? 0} sách</Badge></td>
                  <td className="px-4 py-3 text-gray-500">Invalid Date</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Xem sách (ai cũng thấy) */}
                      <IconBtn title="Xem sách trong danh mục" onClick={() => setViewBooksOf(cat)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a.5.5 0 0 1 0-5H20"/>
                          <polyline points="10 2 10 18"/>
                        </svg>
                      </IconBtn>

                      {/* Admin: Thêm sách vào danh mục (dấu +) */}
                      {isAdmin && (
                        <IconBtn title="Thêm sách vào danh mục" onClick={() => setAddInto(cat)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </IconBtn>
                      )}

                      {/* Admin-only: Sửa / Xóa */}
                      {isAdmin && (
                        <>
                          <IconBtn title="Sửa" onClick={() => setEditItem(cat)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                            </svg>
                          </IconBtn>
                          <IconBtn title="Xóa" onClick={() => remove(cat.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </IconBtn>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards bên dưới */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(cat => (
          <div key={cat.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
              <div className="flex items-center gap-2">
                <Badge>{cat.bookCount ?? 0}</Badge>
                {isAdmin && (
                  <button
                    title="Thêm sách vào danh mục"
                    onClick={() => setAddInto(cat)}
                    className="p-1.5 rounded-md hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{cat.description}</p>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => setViewBooksOf(cat)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
                Xem sách trong danh mục
              </button>
              {isAdmin && (
                <>
                  <button onClick={() => setEditItem(cat)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">Sửa</button>
                  <button onClick={() => remove(cat.id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-red-600">Xóa</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <UpsertCategoryModal
        open={isAdmin && showCreate}
        mode="create"
        onClose={() => setShowCreate(false)}
        onSubmit={add}
      />
      <UpsertCategoryModal
        open={isAdmin && !!editItem}
        mode="edit"
        initial={editItem ?? undefined}
        onClose={() => setEditItem(null)}
        onSubmit={edit}
      />
      <CategoryBooksModal
        open={!!viewBooksOf}
        categoryName={viewBooksOf?.name || ''}
        books={viewBooksOf ? booksOfCategory(viewBooksOf.name) : []}
        onClose={() => setViewBooksOf(null)}
      />
      <AddBookToCategoryModal
        open={isAdmin && !!addInto}
        category={addInto}
        onClose={() => setAddInto(null)}
        onAdded={load}
      />
    </div>
  )
}
