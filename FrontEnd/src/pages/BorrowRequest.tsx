// Tệp: ../FrontEnd/src/pages/BorrowRequest.tsx
import React, { useState } from 'react';
import { borrowingService } from '../services/borrowingService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { CreateBorrowingRequest, BorrowingBookRequest } from '../types/typeRequest';

export function BorrowRequest() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BorrowingBookRequest[]>([{ bookID: 0, quantity: 1 }]);

  const handleAddBook = () => {
    setBooks([...books, { bookID: 0, quantity: 1 }]);
  };

  const handleBookChange = (index: number, field: 'bookID' | 'quantity', value: number) => {
    const newBooks = [...books];
    newBooks[index] = { ...newBooks[index], [field]: value };
    setBooks(newBooks);
  };

  const handleSubmit = async () => {
    if (!user || books.some(b => b.bookID === 0)) {
      toast.error('Vui lòng chọn sách hợp lệ và đăng nhập');
      return;
    }

    try {
      const request: CreateBorrowingRequest = {
        accountID: user.accountID,
        books
      };
      await borrowingService.createBorrowing(request);
      toast.success('Yêu cầu mượn sách đã được gửi');
      setBooks([{ bookID: 0, quantity: 1 }]);
    } catch (error) {
      toast.error('Không thể gửi yêu cầu mượn sách');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu mượn sách</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {books.map((book, index) => (
            <div key={index} className="space-y-2">
              <Input
                type="number"
                placeholder="ID sách"
                value={book.bookID}
                onChange={(e) => handleBookChange(index, 'bookID', parseInt(e.target.value) || 0)}
              />
              <Input
                type="number"
                placeholder="Số lượng"
                value={book.quantity}
                onChange={(e) => handleBookChange(index, 'quantity', parseInt(e.target.value) || 1)}
                min={1}
              />
            </div>
          ))}
          <Button onClick={handleAddBook} variant="outline" className="w-full">
            Thêm sách khác
          </Button>
          <Button onClick={handleSubmit} className="w-full">
            Gửi yêu cầu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}