import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
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
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Users as UsersIcon, 
  Shield, 
  Mail, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { User, AccountStatus } from '../../types/typeEntity';
import { CreateUserRequest, UpdateUserRequest } from '@/types/typeRequest';
import { useAuth } from '@/store/auth';

interface UserFormData {
  fullName: string;
  email: string;
  role: string;
  limitBorrow: number | 5 | undefined;
  limitRenew: number | 3 | undefined;
  status: AccountStatus;
  countViolations: number | 0 | undefined;
}

export function AdminUsers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    role: 'USER',
    limitBorrow: 3,
    limitRenew: 3,
    status: AccountStatus.ACTIVE,
    countViolations: 0
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleStatusChange = async (userId: string, newStatus: AccountStatus) => {
    setUpdatingUser(userId);
    try {
          // Lỗi: 'updateUserStatus' không tồn tại.
          // Fix: Dùng 'updateUser' và lấy data cũ.
          const userToUpdate = users.find(u => u.accountID === userId);
          if (!userToUpdate) {
            toast.error('Không tìm thấy người dùng');
            setUpdatingUser(null);
            return;
          }
      
          const updateData: UpdateUserRequest = {
            fullName: userToUpdate.fullName,
            email: userToUpdate.email,
            role: userToUpdate.role,
            status: newStatus,
            limitBorrow: userToUpdate.userData?.limitBorrow,
            limitRenew: userToUpdate.userData?.limitRenew,
            countViolations: userToUpdate.userData?.countViolations,
          };
          
          await userService.updateUser(userId, updateData);
          
    setUsers(users.map(user => 
            user.accountID === userId ? { ...userToUpdate, status: newStatus } : user
          ));
    toast.success(`Đã ${newStatus === AccountStatus.ACTIVE ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản thành công`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        limitBorrow: user.userData?.limitBorrow,
        limitRenew: user.userData?.limitRenew,
        status: user.status,
        countViolations: user.userData?.countViolations
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        email: '',
        role: 'USER',
        limitBorrow: 5,
        limitRenew: 2,
        status: AccountStatus.ACTIVE,
        countViolations: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
          if (editingUser) {
            // Lỗi: 'updateUser' trả về BooleanResponse, không phải User.
            // Lỗi: 'formData' không khớp 'UpdateUserRequest' (đã sửa ở typeRequest.ts)
            // Fix: Gọi API và tự cập nhật state.
            await userService.updateUser(editingUser.accountID, formData);
            
            // Tự tạo object user mới cho state
            const updatedUserInState: User = {
              ...editingUser,
              fullName: formData.fullName,
              email: formData.email,
              role: formData.role,
              status: formData.status,
              userData: {
                ...(editingUser.userData || { countBorrow: 0, countRenew: 0 }), // Giữ các trường cũ
                limitBorrow: formData.limitBorrow || 5,
                limitRenew: formData.limitRenew || 3,
                countViolations: formData.countViolations || 0,
              }
            };

    setUsers(users.map(user => 
              user.accountID === editingUser.accountID ? updatedUserInState : user
            ));
    toast.success('Cập nhật người dùng thành công');
          } else {
            // Lỗi: 'formData' thiếu 'password' cho 'CreateUserRequest'.
            // Fix: Tạo 'createRequest' và thêm password mặc định.
            const createRequest: CreateUserRequest = {
              email: formData.email,
              fullName: formData.fullName,
              password: "defaultPassword123" // Gửi password mặc định
            };
            const newUser = await userService.createUser(createRequest);
    setUsers([...users, newUser]);
            toast.success('Thêm người dùng mới thành công');
          }
      handleCloseDialog();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);
    try {
      await userService.deleteUser(userToDelete.accountID);
      setUsers(users.filter(user => user.accountID !== userToDelete.accountID));
      toast.success('Xóa người dùng thành công');
      handleCloseDeleteDialog();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa người dùng');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Quản lý người dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và quyền truy cập người dùng</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl">{users.length}</div>
                <div className="text-sm text-muted-foreground">Tổng người dùng</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl">{users.filter(u => u.status === 'ACTIVE').length}</div>
                <div className="text-sm text-muted-foreground">Đang hoạt động</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl">{users.filter(u => u.status === 'BANNED').length}</div>
                <div className="text-sm text-muted-foreground">Ngừng hoạt động</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl">{users.filter(u => u.role === 'ADMIN').length}</div>
                <div className="text-sm text-muted-foreground">Quản trị viên</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
                <span>Danh sách người dùng</span>
              </CardTitle>
              <CardDescription>
                Quản lý thông tin và trạng thái tài khoản người dùng
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-24 h-8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông tin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Vi phạm</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.accountID}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.accountID}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'ACTIVE' ? 'secondary' : 'destructive'}>
                          {user.status === 'ACTIVE' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {user.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={(user.userData?.countViolations || 0) > 0 ? 'text-red-600' : 'text-green-600'}>
                          {user.userData?.countViolations || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role !== 'ADMIN' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDeleteDialog(user)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                              <Button
                                size="sm"
                                variant={user.status === 'ACTIVE' ? 'destructive' : 'default'}
                                onClick={() => handleStatusChange(
                                  user.accountID, 
                                  user.status === AccountStatus.ACTIVE ? AccountStatus.SUSPENDED : AccountStatus.ACTIVE
                                )}
                                disabled={updatingUser === user.accountID}
                              >
                                {updatingUser === user.accountID ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Cập nhật thông tin người dùng. Nhấn lưu để hoàn tất.' 
                  : 'Điền thông tin người dùng mới. Nhấn thêm để hoàn tất.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'USER' | 'ADMIN') => 
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Người dùng</SelectItem>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: AccountStatus ) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AccountStatus.ACTIVE}>Hoạt động</SelectItem>
                      <SelectItem value={AccountStatus.SUSPENDED}>Ngừng hoạt động</SelectItem>
                      <SelectItem value={AccountStatus.BANNED}>Khóa tài khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="limitBorrow">Giới hạn mượn</Label>
                  <Input
                    id="limitBorrow"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.limitBorrow}
                    onChange={(e) => setFormData({ ...formData, limitBorrow: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="limitRenew">Giới hạn gia hạn</Label>
                  <Input
                    id="limitRenew"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.limitRenew}
                    onChange={(e) => setFormData({ ...formData, limitRenew: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="countViolations">Số lần vi phạm</Label>
                <Input
                  id="countViolations"
                  type="number"
                  min="0"
                  value={formData.countViolations}
                  onChange={(e) => setFormData({ ...formData, countViolations: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  editingUser ? 'Lưu thay đổi' : 'Thêm người dùng'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}