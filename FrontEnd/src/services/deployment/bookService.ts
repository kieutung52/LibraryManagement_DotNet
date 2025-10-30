import apiClient from './apiClient';
import { CreateBookRequest, UpdateBookRequest } from '@/types/typeRequest';
import { BookResponse } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';

const getAllBooks = async (): Promise<BookResponse[]> => {
  const response: ApiResponse<BookResponse[]> = await apiClient.get('/Book');
  return response.data!;
};

const getBookById = async (id: number): Promise<BookResponse> => {
  const response: ApiResponse<BookResponse> = await apiClient.get(`/Book/${id}`);
  return response.data!;
};

const createBook = async (data: CreateBookRequest): Promise<BookResponse> => {
  const response: ApiResponse<BookResponse> = await apiClient.post('/Book', data);
  return response.data!;
};

const updateBook = async (id: number, data: UpdateBookRequest): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Book/${id}`, data);
  return response.data!;
};

const deleteBook = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.delete(`/Book/${id}`);
  return response.data!;
};

export const bookService = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};