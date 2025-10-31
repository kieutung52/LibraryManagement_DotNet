// Tệp: ../FrontEnd/src/pages/admin/ShelfLocations.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Package,
  AlertCircle,
  X,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../../components/ui/skeleton';
import { shelfService } from '../../services/shelfService';
import { ShelfLocation, ShelfStatus } from '../../types/typeEntity';

interface ShelfFormData {
  locationName: string;
  description: string;
  status: 'EMPTY' | 'OCCUPIED' | 'FULL';
  capacity: number;
}

export function AdminShelfLocations() {
  const [shelves, setShelves] = useState<ShelfLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewBooksDialogOpen, setViewBooksDialogOpen] = useState(false);
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<ShelfLocation | null>(null);
  const [shelfBooks, setShelfBooks] = useState<any[]>([]); // Placeholder for shelf books
  const [availableBooks, setAvailableBooks] = useState<any[]>([]); // Placeholder for available books
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<ShelfFormData>({
    locationName: '',
    description: '',
    status: 'EMPTY',
    capacity: 50
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShelfFormData, string>>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadShelves();
  }, []);

  const loadShelves = async () => {
    try {
      setLoading(true);
      const data = await shelfService.getAllShelves();
      setShelves(data);
    } catch (error) {
      toast.error('Không thể tải danh sách kệ sách');
    } finally {
      setLoading(false);
    }
  };

  const loadShelfBooks = async (shelfId: number) => {
    // Placeholder: Implement if needed, currently no service method for this
    setShelfBooks([]);
  };

  const loadAvailableBooks = async () => {
    // Placeholder: Use bookService.getAllBooks() if needed
    setAvailableBooks([]);
  };

  const handleOpenDialog = (shelf?: ShelfLocation) => {
    if (shelf) {
      setIsEditing(true);
      setSelectedShelf(shelf);
      setFormData({
        locationName: shelf.locationName,
        description: shelf.description || '',
        status: shelf.status as 'EMPTY' | 'OCCUPIED' | 'FULL',
        capacity: shelf.capacity
      });
    } else {
      setIsEditing(false);
      setSelectedShelf(null);
      setFormData({
        locationName: '',
        description: '',
        status: 'EMPTY',
        capacity: 50
      });
    }
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedShelf(null);
    setFormData({
      locationName: '',
      description: '',
      status: 'EMPTY',
      capacity: 50
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ShelfFormData, string>> = {};

    if (!formData.locationName.trim()) {
      errors.locationName = 'Vui lòng nhập tên kệ';
    }

    if (!formData.description.trim()) {
      errors.description = 'Vui lòng nhập mô tả';
    }

    if (formData.capacity < 1) {
      errors.capacity = 'Sức chứa phải lớn hơn 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && selectedShelf) {
        await shelfService.updateShelf(selectedShelf.shelfID, {
          locationName: formData.locationName,
          description: formData.description || null,
          status: formData.status,
          capacity: formData.capacity
        });
        toast.success('Cập nhật kệ sách thành công');
      } else {
        await shelfService.createShelf({
          locationName: formData.locationName,
          description: formData.description || null,
          capacity: formData.capacity
        });
        toast.success('Thêm kệ sách thành công');
      }
      handleCloseDialog();
      loadShelves();
    } catch (error) {
      toast.error((error as Error).message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async () => {
    if (!selectedShelf) return;

    try {
      await shelfService.deleteShelf(selectedShelf.shelfID);
      toast.success('Xóa kệ sách thành công');
      setDeleteDialogOpen(false);
      setSelectedShelf(null);
      loadShelves();
    } catch (error) {
      toast.error((error as Error).message || 'Không thể xóa kệ sách');
    }
  };

  const handleViewBooks = async (shelf: ShelfLocation) => {
    setSelectedShelf(shelf);
    await loadShelfBooks(shelf.shelfID);
    setViewBooksDialogOpen(true);
  };

  const handleOpenAddBookDialog = async () => {
    await loadAvailableBooks();
    setAddBookDialogOpen(true);
  };

  const handleAddBookToShelf = async () => {
    if (!selectedShelf || !selectedBookId) {
      toast.error('Vui lòng chọn sách');
      return;
    }

    try {
      await shelfService.addBookToShelf({
        bookID: parseInt(selectedBookId),
        shelfID: selectedShelf.shelfID
      });
      toast.success('Thêm sách vào kệ thành công');
      setAddBookDialogOpen(false);
      setSelectedBookId('');
      loadShelves();
      if (selectedShelf) {
        loadShelfBooks(selectedShelf.shelfID);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Không thể thêm sách vào kệ');
    }
  };

  const handleRemoveBookFromShelf = async (bookLocationId: string) => {
    // Placeholder: Implement if service method exists
    try {
      toast.success('Xóa sách khỏi kệ thành công');
      if (selectedShelf) {
        loadShelves();
        loadShelfBooks(selectedShelf.shelfID);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Không thể xóa sách khỏi kệ');
    }
  };

  const getStatusBadge = (status: ShelfStatus) => {
    switch (status) {
      case ShelfStatus.EMPTY:
        return <Badge variant="secondary">Trống</Badge>;
      case ShelfStatus.OCCUPIED:
        return <Badge variant="default">Đang dùng</Badge>;
      case ShelfStatus.FULL:
        return <Badge variant="destructive">Đầy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredShelves = shelves.filter(shelf =>
    shelf.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shelf.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">Quản lý kệ sách</h1>
          <p className="text-muted-foreground">
            Quản lý vị trí và sắp xếp sách trong thư viện
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm kệ mới
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng số kệ</CardDescription>
            <CardTitle className="text-3xl">{shelves.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kệ trống</CardDescription>
            <CardTitle className="text-3xl">
              {shelves.filter(s => s.status === ShelfStatus.EMPTY).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kệ đầy</CardDescription>
            <CardTitle className="text-3xl">
              {shelves.filter(s => s.status === ShelfStatus.FULL).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách kệ sách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm kệ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên kệ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Đang chứa</TableHead>
                  <TableHead>Tỷ lệ lấp đầy</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShelves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không tìm thấy kệ sách nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShelves.map((shelf) => (
                    <TableRow key={shelf.shelfID}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{shelf.locationName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {shelf.description || ''}
                      </TableCell>
                      <TableCell>{getStatusBadge(shelf.status)}</TableCell>
                      <TableCell>{shelf.capacity}</TableCell>
                      <TableCell>{shelf.currentBooks || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (shelf.currentBooks || 0) / shelf.capacity >= 1
                                  ? 'bg-destructive'
                                  : (shelf.currentBooks || 0) / shelf.capacity >= 0.7
                                  ? 'bg-yellow-500'
                                  : 'bg-primary'
                              }`}
                              style={{
                                width: `${Math.min(((shelf.currentBooks || 0) / shelf.capacity) * 100, 100)}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(((shelf.currentBooks || 0) / shelf.capacity) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBooks(shelf)}
                          >
                            <BookOpen className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(shelf)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedShelf(shelf);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Shelf Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Chỉnh sửa kệ sách' : 'Thêm kệ sách mới'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Cập nhật thông tin kệ sách'
                : 'Nhập thông tin kệ sách mới'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">
                  Tên kệ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="locationName"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({ ...formData, locationName: e.target.value })
                  }
                  placeholder="Ví dụ: Kệ A1"
                />
                {formErrors.locationName && (
                  <p className="text-sm text-destructive">{formErrors.locationName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả vị trí hoặc loại sách trên kệ"
                  rows={3}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Sức chứa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Số lượng sách tối đa"
                />
                {formErrors.capacity && (
                  <p className="text-sm text-destructive">{formErrors.capacity}</p>
                )}
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'EMPTY' | 'OCCUPIED' | 'FULL') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPTY">Trống</SelectItem>
                      <SelectItem value="OCCUPIED">Đang dùng</SelectItem>
                      <SelectItem value="FULL">Đầy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kệ "{selectedShelf?.locationName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Books Dialog - Placeholder */}
      {viewBooksDialogOpen && selectedShelf && (
        <Dialog open={viewBooksDialogOpen} onOpenChange={setViewBooksDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Sách trên kệ: {selectedShelf.locationName}</DialogTitle>
            </DialogHeader>
            <DialogContent>
              {/* List shelfBooks here */}
              <p>Shelf books placeholder</p>
            </DialogContent>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Book Dialog - Placeholder */}
      {addBookDialogOpen && selectedShelf && (
        <Dialog open={addBookDialogOpen} onOpenChange={setAddBookDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm sách vào kệ: {selectedShelf.locationName}</DialogTitle>
            </DialogHeader>
            <DialogContent>
              {/* Select book and add */}
              <Button onClick={handleAddBookToShelf}>Thêm sách</Button>
            </DialogContent>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}