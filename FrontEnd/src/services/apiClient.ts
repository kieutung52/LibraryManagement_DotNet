import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/apiResponse';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  ((response: AxiosResponse<ApiResponse<any>>) => {
    return response.data; // Trả về toàn bộ ApiResponse
  }) as unknown as (value: AxiosResponse<any>) => AxiosResponse<any>,
  ((error: AxiosError<ApiResponse<any>>) => {
    if (error.response) {
      const apiResponse = error.response.data;
      const message = apiResponse?.message || error.message;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }) as unknown as (error: AxiosError) => any
);

export default apiClient;