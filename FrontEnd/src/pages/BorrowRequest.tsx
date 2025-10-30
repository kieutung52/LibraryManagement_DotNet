import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookService } from '../services/deployment/bookService';
import { borrowingService } from '../services/deployment/borrowingService';
import { BookResponse } from '../types/typeEntity';
import { CreateBorrowingRequest, BorrowingBookRequest } from '../types/typeRequest';
import { useNavigate } from 'react-router-dom';

export const BorrowRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState<BookResponse[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Map<number, BorrowingBookRequest>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    bookService.getAllBooks()
      .then(data => setAllBooks(data.filter(b => b.availableQuantity > 0)))
      .catch(() => setError('Không thể tải danh sách sách.'));
  }, [isAuthenticated, navigate]);

  const handleSelectBook = (book: BookResponse) => {
    const newSelection = new Map(selectedBooks);
    if (newSelection.has(book.bookID)) {
      newSelection.delete(book.bookID);
    } else {
      if (newSelection.size >= (user?.userData?.limitBorrow || 5)) {
        alert(`Bạn chỉ được mượn tối đa ${user?.userData?.limitBorrow || 5} cuốn.`);
        return;
      }
      newSelection.set(book.bookID, { bookID: book.bookID, quantity: 1 }); // Mặc định số lượng là 1
    }
    setSelectedBooks(newSelection);
  };

  const handleSubmit = async () => {
    if (!user || selectedBooks.size === 0) return;

    setLoading(true);
    setError(null);
    try {
      const requestData: CreateBorrowingRequest = {
        accountID: user.accountID,
        books: Array.from(selectedBooks.values()),
      };
      await borrowingService.createBorrowing(requestData);
      alert('Gửi yêu cầu mượn thành công!');
      navigate('/my-borrowings');
    } catch (err: any) {
      setError(err.message || 'Gửi yêu cầu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const selectedArray = Array.from(selectedBooks.keys());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Yêu cầu mượn sách</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="p-4 bg-white rounded-xl shadow-lg">
        <h2 className="font-semibold mb-2">Sách đã chọn ({selectedBooks.size})</h2>
        <div className="space-y-2 mb-4">
          {selectedArray.length === 0 && <p className="text-sm text-gray-500">Chưa chọn sách nào.</p>}
          {selectedArray.map(bookID => {
            const book = allBooks.find(b => b.bookID === bookID);
            return (
              <div key={bookID} className="flex justify-between items-center text-sm">
                <span>{book?.title}</span>
                <button onClick={() => handleSelectBook(book!)} className="text-red-500 text-xs">Xóa</button>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedBooks.size === 0}
          className="w-full px-4 py-2 font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Đang gửi...' : `Gửi yêu cầu (${selectedBooks.size} sách)`}
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-lg">
        <h2 className="font-semibold mb-4">Chọn sách (Có sẵn)</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allBooks.map(book => {
            const isSelected = selectedBooks.has(book.bookID);
            return (
              <div 
                key={book.bookID}
                onClick={() => handleSelectBook(book)}
                className={`p-3 border rounded-lg cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
              >
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500">{book.categoryName}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
