import React, { useEffect, useState, FormEvent } from 'react';
import { bookService } from '../../services/deployment/bookService';
import { categoryService } from '../../services/deployment/categoryService';
import { BookResponse, CategoryResponse } from '../../types/typeEntity';
import { CreateBookRequest, UpdateBookRequest } from '../../types/typeRequest';

// Modal component (đơn giản)
const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
        {children}
      </div>
    </div>
  </div>
);

// Form Sách
const BookForm = ({
  book,
  categories,
  onSubmit,
  onClose
}: {
  book?: BookResponse | null,
  categories: CategoryResponse[],
  onSubmit: (data: CreateBookRequest | UpdateBookRequest) => Promise<void>,
  onClose: () => void
}) => {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [year, setYear] = useState(book?.publicationYear || new Date().getFullYear());
  const [categoryID, setCategoryID] = useState(book?.categoryID || undefined);
  const [total, setTotal] = useState(book?.totalQuantity || 1);
  const [available, setAvailable] = useState(book?.availableQuantity || 1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (book) {
        // Update
        const data: UpdateBookRequest = {
          title,
          author,
          categoryID,
          publicationYear: year,
          totalQuantity: total,
          availableQuantity: available, // API update yêu cầu cả hai
        };
        await onSubmit(data);
      } else {
        // Create
        const data: CreateBookRequest = {
          title,
          author,
          isbn, // API create yêu cầu ISBN
          categoryID,
          publicationYear: year,
          totalQuantity: total,
        };
        await onSubmit(data);
      }
    } catch (err) {
      console.error(err);
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{book ? 'Sửa sách' : 'Thêm sách mới'}</h2>
      <input type="text" placeholder="Tên sách" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
      <input type="text" placeholder="Tác giả" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full p-2 border rounded" />
      <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required disabled={!!book} className="w-full p-2 border rounded disabled:bg-gray-100" />
      <input type="number" placeholder="Năm XB" value={year} onChange={e => setYear(Number(e.target.value))} className="w-full p-2 border rounded" />
      <select value={categoryID} onChange={e => setCategoryID(Number(e.target.value))} required className="w-full p-2 border rounded">
        <option value="">Chọn danh mục</option>
        {categories.map(c => (
          <option key={c.categoryID} value={c.categoryID}>{c.name}</option>
        ))}
      </select>
      <input type="number" placeholder="Tổng số lượng" value={total} onChange={e => setTotal(Number(e.target.value))} min="1" required className="w-full p-2 border rounded" />
      {book && (
         <input type="number" placeholder="Số lượng có sẵn" value={available} onChange={e => setAvailable(Number(e.target.value))} min="0" max={total} required className="w-full p-2 border rounded" />
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};


export const AdminBooks = () => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResponse | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookData, catData] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAllCategories()
      ]);
      setBooks(bookData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleOpenEdit = (book: BookResponse) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      try {
        await bookService.deleteBook(id);
        await loadData();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleSubmitForm = async (data: CreateBookRequest | UpdateBookRequest) => {
    if (editingBook) {
      await bookService.updateBook(editingBook.bookID, data as UpdateBookRequest);
    } else {
      await bookService.createBook(data as CreateBookRequest);
    }
    await loadData();
    setShowModal(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Sách</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-black text-white rounded-lg">Thêm sách mới</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Tên sách</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Tác giả</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Danh mục</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Số lượng (Có sẵn / Tổng)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {books.map(book => (
              <tr key={book.bookID}>
                <td className="p-4">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">{book.categoryName || 'N/A'}</td>
                <td className="p-4">{book.availableQuantity} / {book.totalQuantity}</td>
                <td className="p-4">
                  <button onClick={() => handleOpenEdit(book)} className="text-sm text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDelete(book.bookID)} className="text-sm text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookForm
            book={editingBook}
            categories={categories}
            onSubmit={handleSubmitForm}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
