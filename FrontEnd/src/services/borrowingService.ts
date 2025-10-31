import apiClient from './apiClient';
import {
  CreateBorrowingRequest,
  RenewBorrowingRequest,
  ReturnBookRequest,
} from '@/types/typeRequest';
import { BorrowingResponse } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';

const createBorrowing = async (data: CreateBorrowingRequest): Promise<BorrowingResponse> => {
  const response: ApiResponse<BorrowingResponse> = await apiClient.post('/Borrowing', data);
  return response.data!;
};

const cancelBorrowing = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Borrowing/${id}/cancel`);
  return response.data!;
};

const approveBorrowing = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Borrowing/${id}/approve`);
  return response.data!;
};

const rejectBorrowing = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Borrowing/${id}/reject`);
  return response.data!;
};

const renewBorrowing = async (data: RenewBorrowingRequest): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put('/Borrowing/renew', data);
  return response.data!;
};

const returnBook = async (data: ReturnBookRequest): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Borrowing/return/${data.borrowingDetailId}`, data);
  return response.data!;
};

const getMyBorrowings = async (): Promise<BorrowingResponse[]> => {
  const response: ApiResponse<BorrowingResponse[]> = await apiClient.get('/Borrowing/my-borrowings');
  return response.data!;
};

const getAllBorrowings = async (): Promise<BorrowingResponse[]> => {
  const response: ApiResponse<BorrowingResponse[]> = await apiClient.get('/Borrowing');
  return response.data!;
};

const getBorrowingById = async (id: number): Promise<BorrowingResponse> => {
  const response: ApiResponse<BorrowingResponse> = await apiClient.get(`/Borrowing/${id}`);
  return response.data!;
};

export const borrowingService = {
  createBorrowing,
  cancelBorrowing,
  approveBorrowing,
  rejectBorrowing,
  renewBorrowing,
  returnBook,
  getMyBorrowings,
  getAllBorrowings,
  getBorrowingById,
};