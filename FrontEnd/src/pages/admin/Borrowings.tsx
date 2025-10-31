import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, 
  DialogClose,  
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  BookMarked, 
  User, 
  Calendar, 
  Hash, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArchiveRestore 
} from 'lucide-react';
import { toast } from 'sonner';
import { borrowingService } from '../../services/borrowingService';
import { BorrowingResponse, BorrowingStatus, BorrowingDetailStatus } from '../../types/typeEntity';
import { ReturnBookRequest } from '@/types/typeRequest';

export function AdminBorrowings() {
  const { isAdmin } = useAuth();
  const [borrowings, setBorrowings] = useState<BorrowingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [processingSlip, setProcessingSlip] = useState<number | null>(null);
  
  
  
  const [slipToReturn, setSlipToReturn] = useState<BorrowingResponse | null>(null); 
  const [returnIsbn, setReturnIsbn] = useState(''); 
  const [returningDetailId, setReturningDetailId] = useState<number | null>(null); 
  

  useEffect(() => {
    if (!isAdmin) return;

    const fetchBorrowings = async () => {
      setLoading(true);
      try {
        const data = await borrowingService.getAllBorrowings();
        setBorrowings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách mượn sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowings();
  }, [isAdmin, statusFilter]); 

  const handleApprove = async (slipId: number) => {
    
    setProcessingSlip(slipId);
    try {
      await borrowingService.approveBorrowing(slipId);
      setBorrowings(borrowings.map(slip => 
        slip.borrowingID === slipId ? { ...slip, status: BorrowingStatus.APPROVED } : slip
      ));
      toast.success('Đã phê duyệt yêu cầu mượn sách');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể phê duyệt yêu cầu');
    } finally {
      setProcessingSlip(null);
    }
  };

  const handleReject = async (slipId: number) => {
    
     setProcessingSlip(slipId);
    try {
      await borrowingService.rejectBorrowing(slipId);
      setBorrowings(borrowings.map(slip => 
        slip.borrowingID === slipId ? { ...slip, status: BorrowingStatus.REJECTED } : slip
      ));
      toast.success('Đã từ chối yêu cầu mượn sách');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể từ chối yêu cầu');
    } finally {
      setProcessingSlip(null);
    }
  };

  
  const handleReturn = async () => {
    
    if (!returningDetailId || !returnIsbn.trim()) {
      toast.error('Vui lòng chọn sách và nhập ISBN/Mã vạch');
      return;
    }

    try {
      const requestData: ReturnBookRequest = {
        borrowingDetailId: returningDetailId,
        isbn: returnIsbn.trim()
      };
      await borrowingService.returnBook(requestData);
      
      
      const data = await borrowingService.getAllBorrowings();
      setBorrowings(data);
      
      
      setSlipToReturn(null);
      setReturningDetailId(null);
      setReturnIsbn('');
      
      toast.success('Đã xử lý trả sách thành công');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xử lý trả sách');
    }
  };
  


  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'OVERDUE':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-700">Chờ duyệt</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="border-blue-600 text-blue-700">Đã duyệt</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn tất</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">Quá hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          Bạn không có quyền truy cập trang này
        </AlertDescription>
      </Alert>
    );
  }

  const stats = {
    
    pending: borrowings.filter(b => b.status === BorrowingStatus.PENDING).length,
    approved: borrowings.filter(b => b.status === BorrowingStatus.APPROVED).length,
    returned: borrowings.filter(b => b.status === BorrowingStatus.COMPLETED).length,
    overdue: borrowings.filter(b => b.status === BorrowingStatus.OVERDUE).length,
  };

  const filteredBorrowings = statusFilter 
    ? borrowings.filter(slip => slip.status === statusFilter) 
    : borrowings;

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Quản lý mượn sách</h1>
        <p className="text-muted-foreground">Xem xét và xử lý các yêu cầu mượn trả sách</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Giữ nguyên các thẻ Card thống kê) ... */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Chờ duyệt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">Đã duyệt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl">{stats.returned}</div>
                <div className="text-sm text-muted-foreground">Đã trả</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl">{stats.overdue}</div>
                <div className="text-sm text-muted-foreground">Quá hạn</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center space-x-4">
              <Label htmlFor="status-filter">Lọc theo trạng thái:</Label>
              <Select value={statusFilter || 'all'} onValueChange={(value : string) => setStatusFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
                  <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* === XÓA DIALOG TRẢ SÁCH TOÀN CỤC === */}
            {/* ... Khối <Dialog open={returnDialogOpen} ...> đã bị xóa ... */}
            
          </div>
        </CardContent>
      </Card>

      {/* Borrowings Table */}
      <Card>
        {/* ... (Giữ nguyên CardHeader và Skeleton) ... */}
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5" />
            <span>Danh sách mượn sách</span>
          </CardTitle>
          <CardDescription>
            Quản lý và xử lý các yêu cầu mượn trả sách
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-24 h-8" />
                </div>
              ))}
            </div>
          ) : filteredBorrowings.length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">Không có yêu cầu mượn sách</h3>
              <p className="text-muted-foreground">
                {statusFilter ? 'Không có yêu cầu nào phù hợp với bộ lọc' : 'Chưa có yêu cầu mượn sách nào'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người mượn</TableHead>
                    <TableHead>Sách</TableHead>
                    <TableHead>Ngày mượn</TableHead>
                    <TableHead>Hạn trả</TableHead>
                    <TableHead>Trạng thái Phiếu</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBorrowings.map((slip) => (
                    <TableRow key={slip.borrowingID}>
                      {/* ... (Giữ nguyên các TableCell cho Người mượn, Sách, Ngày mượn, Hạn trả) ... */}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                         <div>
                            <div className="font-medium" title={slip.accountID}>{slip.accountID.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {slip.details.map((detail) => (
                            <div key={detail.borrowingDetailID} className="text-sm">
                              <div className="font-medium line-clamp-1">{detail.bookTitle}</div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Hash className="w-3 h-3" />
                                <span>BookID: {detail.bookID.toString()}</span>
                                <span className="ml-2">| Qty: {detail.quantityBook}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(slip.borrowDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {slip.details.map((detail) => (
                            <div key={detail.borrowingDetailID} className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className={
                                new Date(detail.dueDate) < new Date() && slip.status !== BorrowingStatus.COMPLETED 
                                  ? 'text-red-600'
                                  : ''
                              }>
                                {new Date(detail.dueDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(slip.status)}
                          {getStatusBadge(slip.status)}
                        </div>
                      </TableCell>

                      {/* === CẬP NHẬT CỘT THAO TÁC === */}
                      <TableCell>
                        <div className="flex gap-2">
                          {slip.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                className="w-[100px] h-9 bg-blue-100 hover:bg-blue-300 dark:bg-blue-100 dark:hover:bg-blue-300"
                                onClick={() => handleApprove(slip.borrowingID)} 
                                disabled={processingSlip === slip.borrowingID} 
                              >
                                {processingSlip === slip.borrowingID ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                                ) : (
                                  'Phê duyệt'
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-[80px] h-9 bg-red-400 text-white hover:bg-red-600 dark:bg-red-400 dark:text-white dark:hover:bg-red-700"
                                onClick={() => handleReject(slip.borrowingID)}
                                disabled={processingSlip === slip.borrowingID}
                              >
                                {processingSlip === slip.borrowingID ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  'Từ chối'
                                )}
                              </Button>
                            </>
                          )}
                          
                          {/* === THÊM NÚT TRẢ SÁCH MỚI === */}
                          {(slip.status === BorrowingStatus.APPROVED || slip.status === BorrowingStatus.OVERDUE) && (
                            <Dialog 
                              open={slipToReturn?.borrowingID === slip.borrowingID} 
                              onOpenChange={(isOpen : boolean) => {
                                if (!isOpen) {
                                  setSlipToReturn(null);
                                  setReturningDetailId(null);
                                  setReturnIsbn('');
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSlipToReturn(slip)}
                                  className="h-9"
                                >
                                  <ArchiveRestore className="w-4 h-4 mr-2" />
                                  Trả sách
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Trả sách cho phiếu #{slip.borrowingID}</DialogTitle>
                                  <DialogDescription>
                                    Chọn sách và nhập ISBN/Mã vạch để xác nhận trả.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {(() => {
                                  
                                  const booksToReturn = slip.details.filter(
                                    d => d.status === BorrowingDetailStatus.BORROWING || d.status === BorrowingDetailStatus.OVERDUE
                                  );

                                  if (booksToReturn.length === 0) {
                                    return (
                                      <Alert>
                                        <AlertTriangle className="w-4 h-4" />
                                        <AlertDescription>
                                          Tất cả sách trong phiếu này đã được trả.
                                        </AlertDescription>
                                      </Alert>
                                    );
                                  }

                                  return (
                                    <div className="space-y-4 pt-4">
                                      <div>
                                        <Label htmlFor="book-select">Chọn sách cần trả</Label>
                                        <Select 
                                          onValueChange={(value : any) => setReturningDetailId(Number(value))}
                                        >
                                          <SelectTrigger id="book-select">
                                            <SelectValue placeholder="-- Chọn sách --" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {booksToReturn.map((detail) => (
                                              <SelectItem 
                                                key={detail.borrowingDetailID} 
                                                value={detail.borrowingDetailID.toString()}
                                              >
                                                {detail.bookTitle} (ID: {detail.borrowingDetailID})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="barcode-input">ISBN / Mã vạch sách</Label>
                                        <Input
                                          id="barcode-input"
                                          value={returnIsbn}
                                          onChange={(e) => setReturnIsbn(e.target.value)}
                                          placeholder="Nhập hoặc quét ISBN/Mã vạch..."
                                        />
                                      </div>
                                      <DialogFooter className="pt-4">
                                        <DialogClose asChild>
                                          <Button variant="outline">Hủy</Button>
                                        </DialogClose>
                                        <Button onClick={handleReturn}>
                                          Xác nhận trả sách
                                        </Button>
                                      </DialogFooter>
                                    </div>
                                  );
                                })()}
                              </DialogContent>
                            </Dialog>
                          )}
                          {/* === KẾT THÚC THÊM NÚT TRẢ SÁCH === */}
                        </div>
                      </TableCell>
                      {/* === KẾT THÚC CẬP NHẬT CỘT THAO TÁC === */}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}