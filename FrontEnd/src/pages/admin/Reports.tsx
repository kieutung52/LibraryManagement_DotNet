import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/deployment/adminService';
import { DataAnalyticsDaily } from '../../types/typeEntity';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export const AdminReports = () => {
  const { isAdmin } = useAuth();
  const [kpi, setKpi] = useState<DataAnalyticsDaily | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await adminService.getTodayAnalytics();
        setKpi(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  if (loading) return <div>Đang tải thống kê...</div>;
  if (!kpi) return <div>Không có dữ liệu thống kê.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard (Hôm nay)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Lượt mượn" value={kpi.countBorrowings} />
        <StatCard label="Yêu cầu chờ" value={kpi.countBorrowingsRequestPending} />
        <StatCard label="Sắp hết hạn" value={kpi.countBorrowingsToExpire} />
        <StatCard label="Vi phạm" value={kpi.countUsersViolations} />
        <StatCard label="Khách truy cập" value={kpi.countUsersVisited} />
        <StatCard label="Khách quay lại" value={kpi.countUserBack} />
      </div>
    </div>
  );
};
