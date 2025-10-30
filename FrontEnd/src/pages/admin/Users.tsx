import React, { useEffect, useState } from 'react';
import { userService } from '../../services/deployment/userService';
import { UserResponse } from '../../types/typeEntity';

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Đang tải danh sách người dùng...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
        <button className="px-4 py-2 bg-black text-white rounded-lg">(Chức năng Thêm/Sửa)</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Họ và tên</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Vai trò</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.accountID}>
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.status}</td>
                <td className="p-4">
                  <button className="text-sm text-blue-600 mr-2">Sửa</button>
                  <button className="text-sm text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
