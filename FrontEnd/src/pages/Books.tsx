import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/deployment/bookService';
import { BookResponse } from '../types/typeEntity';

const BookCard = ({ book }: { book: BookResponse }) => (
  <Link to={`/books/${book.bookID}`} className="block p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-bold truncate">{book.title}</h3>
    <p className="text-sm text-gray-600">{book.author}</p>
    <p className="text-sm text-gray-500 mt-2">{book.categoryName || 'Không có danh mục'}</p>
    <div className={`mt-4 text-sm font-medium ${book.availableQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
      {book.availableQuantity > 0 ? `Còn ${book.availableQuantity}` : 'Hết sách'}
    </div>
  </Link>
);

export const Books = () => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks();
        setBooks(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải sách');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <div>Đang tải sách...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Danh mục Sách</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.bookID} book={book} />
        ))}
      </div>
    </div>
  );
};
