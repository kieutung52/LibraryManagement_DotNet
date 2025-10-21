import { useEffect, useMemo, useState } from 'react'
import { booksService } from '@/server/books'
import { categoriesService } from '@/server/categories'
import { Book } from '@/types/book'

function BookDetailModal({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl modal-content-scrollable">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-2xl font-bold text-gray-900">{book.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2"><p className="font-semibold">Tác giả:</p><p>{book.author}</p></div>
          <div className="flex justify-between border-b pb-2"><p className="font-semibold">Năm xuất bản:</p><p>{book.year}</p></div>
          <div className="flex justify-between border-b pb-2"><p className="font-semibold">Mã sách:</p><p>{book.code}</p></div>
          <div className="flex justify-between border-b pb-2">
            <p className="font-semibold">Danh mục:</p>
            <span className="inline-block bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">{book.category}</span>
          </div>
          <div className="flex justify-between border-b pb-2"><p className="font-semibold">Số lượng:</p><p>{book.available} / {book.stock}</p></div>
          <div>
            <p className="font-semibold mb-2">Mô tả:</p>
            <p className="text-sm italic">{book.description || 'Không có mô tả chi tiết.'}</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t text-center">
          <button
            disabled={book.available <= 0}
            onClick={() => alert(`Yêu cầu mượn sách: ${book.title}`)}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${
              book.available > 0 ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {book.available > 0 ? 'Yêu cầu Mượn sách' : 'Hết sách'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  const isAvailable = book.available > 0
  return (
    <div onClick={onClick}
         className="p-6 bg-white border border-gray-200 rounded-xl shadow-md flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow">
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
          disabled={!isAvailable}
          className={`w-full text-center py-2 rounded-lg font-medium transition-colors ${
            isAvailable ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  )
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [selected, setSelected] = useState<Book | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    booksService.getAll().then(setBooks)
    categoriesService.getAll().then((cats) => {
      setCategories(['Tất cả danh mục', ...cats.map(c => c.name)])
    })
  }, [])

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchCat = filterCategory === 'Tất cả danh mục' || b.category === filterCategory
      const matchSearch = !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [books, filterCategory, search])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} />}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh sách sách</h1>
        <p className="text-gray-500">Khám phá thư viện sách phong phú</p>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách hoặc tác giả"
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
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length ? (
          filtered.map(b => <BookCard key={b.id} book={b} onClick={() => setSelected(b)} />)
        ) : (
          <p className="col-span-4 text-center text-gray-500 p-10 bg-white rounded-xl">Không tìm thấy sách phù hợp.</p>
        )}
      </div>
    </div>
  )
}
