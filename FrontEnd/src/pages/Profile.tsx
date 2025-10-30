import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
      {user && (
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <label className="text-sm text-gray-500">Họ và tên</label>
            <p className="text-lg font-medium">{user.fullName}</p>
          </div>
          <div className="pb-2 border-b">
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div className="pb-2 border-b">
            <label className="text-sm text-gray-500">Vai trò</label>
            <p className="text-lg font-medium">{user.role}</p>
          </div>
          <div className="pb-2 border-b">
            <label className="text-sm text-gray-500">Trạng thái</label>
            <p className="text-lg font-medium">{user.status}</p>
          </div>
          {user.userData && (
            <>
              <div className="pb-2 border-b">
                <label className="text-sm text-gray-500">Giới hạn mượn</label>
                <p className="text-lg font-medium">{user.userData.limitBorrow} cuốn</p>
              </div>
              <div className="pb-2 border-b">
                <label className="text-sm text-gray-500">Số lần vi phạm</label>
                <p className="text-lg font-medium">{user.userData.countViolations}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
