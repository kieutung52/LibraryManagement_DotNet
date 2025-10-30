import React, { useEffect, useState } from 'react';
import { borrowingService } from '../services/deployment/borrowingService';
import { BorrowingResponse, BorrowingStatus, BorrowingDetailStatus } from '../types/typeEntity';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const statusMap: Record<number, string> = {
  [BorrowingStatus.PENDING]: 'Chờ duyệt',
  [BorrowingStatus.APPROVED]: 'Đã duyệt',
  [BorrowingStatus.REJECTED]: 'Đã từ chối',
  [BorrowingStatus.COMPLETED]: 'Đã hoàn thành',
};

const statusClasses: Record<number, string> = {
  [BorrowingStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [BorrowingStatus.APPROVED]: 'bg-blue-100 text-blue-700',
  [BorrowingStatus.REJECTED]: 'bg-gray-100 text-gray-700',
  [BorrowingStatus.COMPLETED]: 'bg-green-100 text-green-700',
};

const detailStatusMap: Record<number, string> = {
  [BorrowingDetailStatus.PENDING]: 'Chờ mượn',
  [BorrowingDetailStatus.BORROWING]: 'Đang mượn',
  [BorrowingDetailStatus.RETURNED]: 'Đã trả',
  [BorrowingDetailStatus.OVERDUE]: 'Quá hạn',
  [BorrowingDetailStatus.LOST]: 'Bị mất',
};

export const MyHistory = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<BorrowingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await borrowingService.getMyBorrowings();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isAuthenticated, authLoading]);

  if (authLoading) return <div>Đang tải...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Lịch sử mượn sách</h1>
      {loading && <div>Đang tải lịch sử...</div>}
      {!loading && history.length === 0 && <p>Bạn chưa có lịch sử mượn sách.</p>}
      
      <div className="space-y-6">
        {history.map(loan => (
          <div key={loan.borrowingID} className="p-4 bg-white rounded-xl shadow-lg border">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h2 className="text-lg font-bold">Phiếu mượn #{loan.borrowingID}</h2>
                <p className="text-sm text-gray-500">Ngày mượn: {new Date(loan.borrowDate).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[loan.status]}`}>
                {statusMap[loan.status]}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {loan.details.map(detail => (
                <div key={detail.borrowingDetailID} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{detail.bookTitle}</p>
                  <p className="text-sm text-gray-600">Số lượng: {detail.quantityBook}</p>
                  <p className="text-sm text-gray-600">Hạn trả: {new Date(detail.dueDate).toLocaleDateString()}</p>
                  <p className={`text-sm font-medium ${detail.status === BorrowingDetailStatus.OVERDUE ? 'text-red-500' : ''}`}>
                    Trạng thái sách: {detailStatusMap[detail.status]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
