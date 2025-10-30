import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '../services/deployment/bookService';
import { BookResponse } from '../types/typeEntity';

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBookById(Number(id));
        setBook(data);
      } catch (err: any) {
        setError(err.message || 'Không tìm thấy sách');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!book) return <div>Không tìm thấy sách.</div>;

  const isAvailable = book.availableQuantity > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/books" className="text-sm hover:underline mb-4 inline-block">&larr; Quay lại danh sách</Link>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-xl text-gray-700 mb-4">{book.author}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="pb-2">
            <span className="text-gray-500">ISBN</span>
            <p className="font-medium">{book.isbn}</p>
          </div>
          <div className="pb-2">
            <span className="text-gray-500">Năm XB</span>
            <p className="font-medium">{book.publicationYear || 'N/A'}</p>
          </div>
          <div className="pb-2">
            <span className="text-gray-500">Danh mục</span>
            <p className="font-medium">{book.categoryName || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-gray-500 text-sm">Tổng số</span>
            <p className="text-2xl font-bold">{book.totalQuantity}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Có sẵn</span>
            <p className={`text-2xl font-bold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
              {book.availableQuantity}
            </p>
          </div>
        </div>

        <button
          disabled={!isAvailable}
          className="w-full mt-6 px-4 py-3 font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAvailable ? 'Yêu cầu mượn' : 'Đã hết sách'}
        </button>
      </div>
    </div>
  );
};
