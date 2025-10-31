import apiClient from './apiClient';
import { CreateUserRequest, UpdateUserRequest } from '@/types/typeRequest';
import { User } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';

const getAllUsers = async (): Promise<User[]> => {
  const response: ApiResponse<User[]> = await apiClient.get('/User');
  return response.data!;
};

const getUserById = async (id: string): Promise<User> => {
  const response: ApiResponse<User> = await apiClient.get(`/User/${id}`);
  return response.data!;
};

const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response: ApiResponse<User> = await apiClient.post('/User', data);
  return response.data!;
};

const updateUser = async (id: string, data: UpdateUserRequest): Promise<BooleanResponse> => {
  console.warn(data);
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/User/${id}`, data);
  return response.data!;
};

const deleteUser = async (id: string): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.delete(`/User/${id}`);
  return response.data!;
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};