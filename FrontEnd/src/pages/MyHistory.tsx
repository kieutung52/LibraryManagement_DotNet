import React, { useEffect, useState } from 'react';
import { borrowingService } from '../services/borrowingService';
import { BorrowingResponse, BorrowingStatus, BorrowingDetailStatus } from '../types/typeEntity';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Navigate } from 'react-router-dom';
import { BookOpen, Calendar, Hash, AlertTriangle, Clock, CheckCircle, XCircle, History } from 'lucide-react';

const statusMap: Record<BorrowingStatus, string> = {
  [BorrowingStatus.PENDING]: 'Chờ duyệt',
  [BorrowingStatus.APPROVED]: 'Đã duyệt',
  [BorrowingStatus.REJECTED]: 'Đã từ chối',
  [BorrowingStatus.COMPLETED]: 'Đã hoàn thành',
  [BorrowingStatus.OVERDUE] : 'Qúa hạn',
};

const detailStatusMap: Record<BorrowingDetailStatus, string> = {
  [BorrowingDetailStatus.PENDING]: 'Chờ mượn',
  [BorrowingDetailStatus.BORROWING]: 'Đang mượn',
  [BorrowingDetailStatus.RETURNED]: 'Đã trả',
  [BorrowingDetailStatus.OVERDUE]: 'Quá hạn',
  [BorrowingDetailStatus.LOST]: 'Bị mất',
};

export function MyHistory() {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<BorrowingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchHistory = async () => {
      try {
        const data = await borrowingService.getMyBorrowings();
        setHistory(data);
      } catch (err) {
        setError((err as Error).message || 'Không thể tải lịch sử mượn sách');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const getStatusIcon = (status: BorrowingDetailStatus) => {
    switch (status) {
      case BorrowingDetailStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case BorrowingDetailStatus.BORROWING:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case BorrowingDetailStatus.RETURNED:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case BorrowingDetailStatus.OVERDUE:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: BorrowingDetailStatus) => {
    let variant = 'outline';
    let className = '';
    switch (status) {
      case BorrowingDetailStatus.PENDING:
        className = 'border-yellow-600 text-yellow-700';
        break;
      case BorrowingDetailStatus.BORROWING:
        className = 'border-blue-600 text-blue-700';
        break;
      case BorrowingDetailStatus.RETURNED:
        variant = 'secondary';
        className = 'bg-green-100 text-green-800';
        break;
      case BorrowingDetailStatus.OVERDUE:
        variant = 'destructive';
        break;
      default:
        break;
    }
    return <Badge variant={variant} className={className}>{detailStatusMap[status]}</Badge>;
  };

  const isOverdue = (dueDate: string, status: BorrowingDetailStatus) => {
    return status !== BorrowingDetailStatus.RETURNED && new Date(dueDate) < new Date();
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  const flattenedHistory = history.flatMap(borrowing =>
    borrowing.details.map(detail => ({
      slipId: borrowing.borrowingID.toString(),
      bookTitle: detail.bookTitle,
      barcode: detail.bookID.toString(), 
      borrowDate: borrowing.borrowDate,
      dueDate: detail.dueDate,
      returnDate: detail.returnDate,
      status: detail.status,
    }))
  );

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Lịch sử mượn sách</h1>
        <p className="text-muted-foreground">Theo dõi tất cả các lần mượn sách của bạn</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Lịch sử mượn sách</span>
          </CardTitle>
          <CardDescription>
            Danh sách tất cả các lần mượn sách và trạng thái hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="w-20 h-6" />
                </div>
              ))}
            </div>
          ) : flattenedHistory.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">Chưa có lịch sử mượn sách</h3>
              <p className="text-muted-foreground">
                Bạn chưa mượn cuốn sách nào. Hãy khám phá thư viện và mượn sách yêu thích!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flattenedHistory.map((item, index) => (
                <div 
                  key={`${item.slipId}-${index}`}
                  className={`p-4 border rounded-lg transition-colors ${
                    isOverdue(item.dueDate, item.status) ? 'border-red-200 bg-red-50' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="line-clamp-2 mb-2">{item.bookTitle}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Hash className="w-3 h-3" />
                              <span>Mã vạch: {item.barcode}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3" />
                              <span>Ngày mượn: {new Date(item.borrowDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3" />
                              <span className={isOverdue(item.dueDate, item.status) ? 'text-red-600' : ''}>
                                Hạn trả: {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            {item.returnDate && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3 h-3" />
                                <span>Ngày trả: {new Date(item.returnDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      {getStatusBadge(item.status)}
                      {isOverdue(item.dueDate, item.status) && (
                        <div className="text-xs text-red-600 text-right">
                          Quá hạn {Math.floor((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} ngày
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {flattenedHistory.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Thống kê tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl text-primary mb-1">{flattenedHistory.length}</div>
                <div className="text-sm text-muted-foreground">Tổng lượt mượn</div>
              </div>
              <div>
                <div className="text-2xl text-green-600 mb-1">
                  {flattenedHistory.filter(h => h.status === BorrowingDetailStatus.RETURNED).length}
                </div>
                <div className="text-sm text-muted-foreground">Đã trả</div>
              </div>
              <div>
                <div className="text-2xl text-blue-600 mb-1">
                  {flattenedHistory.filter(h => h.status === BorrowingDetailStatus.BORROWING).length}
                </div>
                <div className="text-sm text-muted-foreground">Đang mượn</div>
              </div>
              <div>
                <div className="text-2xl text-red-600 mb-1">
                  {flattenedHistory.filter(h => h.status === BorrowingDetailStatus.OVERDUE).length}
                </div>
                <div className="text-sm text-muted-foreground">Quá hạn</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}