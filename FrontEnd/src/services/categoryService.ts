import apiClient from './apiClient';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/typeRequest';
import { Category } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';

const getAllCategories = async (): Promise<Category[]> => {
  const response: ApiResponse<Category[]> = await apiClient.get('/Category');
  return response.data!;
};

const getCategoryById = async (id: number): Promise<Category> => {
  const response: ApiResponse<Category> = await apiClient.get(`/Category/${id}`);
  return response.data!;
};

const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response: ApiResponse<Category> = await apiClient.post('/Category', data);
  return response.data!;
};

const updateCategory = async (id: number, data: UpdateCategoryRequest): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Category/${id}`, data);
  return response.data!;
};

const deleteCategory = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.delete(`/Category/${id}`);
  return response.data!;
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};