import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { DashboardSummary, WeeklyStats, DataAnalyticsDaily } from '../../types/typeEntity';
import { useAuth } from '@/store/auth';

export function AdminReports() {
  const { isAdmin } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const fetchReports = async () => {
      try {
        // Fix: Thêm 2 tham số date cho getBorrowingStats
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Fix: Sửa tên biến và Promise.all
        const [statsData, todayData] = await Promise.all([
          adminService.getBorrowingStats(thirtyDaysAgo, today),
          adminService.getTodayAnalytics(),
        ]);

        // Fix: Gán 'statsData' (từ getBorrowingStats) cho 'weeklyStats'
        // 'as WeeklyStats[]' để bảo TypeScript tin tưởng kiểu 'any'
        setWeeklyStats(statsData as WeeklyStats[]);
        
        // Fix: Map 'todayData' (từ getTodayAnalytics) sang 'summary'
        const summary: DashboardSummary = {
            pendingRequests: todayData.countBorrowingsRequestPending,
            borrowedToday: todayData.countBorrowings,
            overdueBooks: todayData.countBorrowingsToExpire,
            activeUsers: todayData.countUsersVisited // Giả định map
        };
    setSummary(summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải báo cáo');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAdmin]);

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
        <h1 className="text-3xl mb-2">Báo cáo và thống kê</h1>
        <p className="text-muted-foreground">Tổng quan hoạt động thư viện và phân tích dữ liệu</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : summary ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl">{summary.pendingRequests}</div>
                    <div className="text-sm text-muted-foreground">Yêu cầu chờ duyệt</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl">{summary.borrowedToday}</div>
                    <div className="text-sm text-muted-foreground">Mượn hôm nay</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-2xl">{summary.overdueBooks}</div>
                    <div className="text-sm text-muted-foreground">Sách quá hạn</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl">{summary.activeUsers}</div>
                    <div className="text-sm text-muted-foreground">Người dùng hoạt động</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Borrowings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Thống kê mượn sách theo tuần</span>
            </CardTitle>
            <CardDescription>
              Số lượng sách được mượn trong 4 tuần gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs"
                    stroke="currentColor"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="currentColor"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="borrowings" 
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Weekly Violations Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Thống kê vi phạm theo tuần</span>
            </CardTitle>
            <CardDescription>
              Số lượng vi phạm trong 4 tuần gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs"
                    stroke="currentColor"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="currentColor"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="violations" 
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Combined Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Tổng quan hoạt động thư viện</span>
          </CardTitle>
          <CardDescription>
            So sánh mượn sách và vi phạm theo tuần
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week" 
                  className="text-xs"
                  stroke="currentColor"
                />
                <YAxis 
                  className="text-xs"
                  stroke="currentColor"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="borrowings" 
                  fill="hsl(var(--chart-1))"
                  name="Lượt mượn"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="violations" 
                  fill="hsl(var(--chart-2))"
                  name="Vi phạm"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Xu hướng mượn sách</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trung bình mỗi tuần</span>
                <span className="font-medium">
                  {weeklyStats.length > 0 
                    ? Math.round(weeklyStats.reduce((acc, stat) => acc + stat.borrowings, 0) / weeklyStats.length)
                    : 0
                  } lượt
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tuần cao nhất</span>
                <span className="font-medium">
                  {weeklyStats.length > 0 
                    ? Math.max(...weeklyStats.map(stat => stat.borrowings))
                    : 0
                  } lượt
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tăng trưởng</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Tình hình vi phạm</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trung bình mỗi tuần</span>
                <span className="font-medium">
                  {weeklyStats.length > 0 
                    ? Math.round(weeklyStats.reduce((acc, stat) => acc + stat.violations, 0) / weeklyStats.length * 10) / 10
                    : 0
                  } vi phạm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tuần cao nhất</span>
                <span className="font-medium">
                  {weeklyStats.length > 0 
                    ? Math.max(...weeklyStats.map(stat => stat.violations))
                    : 0
                  } vi phạm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Thay đổi</span>
                <span className="font-medium text-green-600">-8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}