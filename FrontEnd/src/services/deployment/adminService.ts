import apiClient from './apiClient';
import { DataAnalyticsDaily } from '@/types/typeEntity';
import { ApiResponse } from '@/types/apiResponse';

const getTodayAnalytics = async (): Promise<DataAnalyticsDaily> => {
  const response: ApiResponse<DataAnalyticsDaily> = await apiClient.get('/Admin/analytics/today');
  return response.data!;
};

const getBorrowingStats = async (startDate: string, endDate: string): Promise<any> => {
  const response: ApiResponse<any> = await apiClient.get('/Admin/analytics/borrowing-stats', {
    params: { startDate, endDate },
  });
  return response.data!;
};

export const adminService = {
  getTodayAnalytics,
  getBorrowingStats,
};