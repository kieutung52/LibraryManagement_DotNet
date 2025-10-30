import React, { useEffect, useState, useMemo } from 'react';
import { borrowingService } from '../../services/deployment/borrowingService';
import { BorrowingResponse, BorrowingStatus } from '../../types/typeEntity';

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

export const AdminBorrowings = () => {
  const [borrowings, setBorrowings] = useState<BorrowingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL'); // 'ALL', 'PENDING', ...

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await borrowingService.getAllBorrowings();
      setBorrowings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn duyệt phiếu mượn này?')) {
      try {
        await borrowingService.approveBorrowing(id);
        await loadData();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn từ chối phiếu mượn này?')) {
      try {
        await borrowingService.rejectBorrowing(id);
        await loadData();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const filteredData = useMemo(() => {
    if (filter === 'ALL') return borrowings;
    const statusKey = Object.keys(BorrowingStatus).find(key => key === filter);
    if (statusKey) {
      // @ts-ignore
      return borrowings.filter(b => b.status === BorrowingStatus[statusKey]);
    }
    return borrowings;
  }, [borrowings, filter]);


  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Mượn/Trả</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-lg">
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
          <option value="COMPLETED">Đã hoàn thành</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Mã Phiếu</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Account ID</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Ngày mượn</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map(loan => (
              <tr key={loan.borrowingID}>
                <td className="p-4">{loan.borrowingID}</td>
                <td className="p-4 text-xs">{loan.accountID}</td>
                <td className="p-4">{new Date(loan.borrowDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[loan.status]}`}>
                    {statusMap[loan.status]}
                  </span>
                </td>
                <td className="p-4">
                  {loan.status === BorrowingStatus.PENDING && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(loan.borrowingID)} className="text-sm text-green-600">Duyệt</button>
                      <button onClick={() => handleReject(loan.borrowingID)} className="text-sm text-red-600">Từ chối</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
