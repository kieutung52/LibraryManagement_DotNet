import apiClient from './apiClient';
import { LoginRequest, RegisterRequest } from '@/types/typeRequest';
import { AuthenticationResponse } from '@/types/typeResponse';
import { UserResponse } from '@/types/typeEntity';
import { ApiResponse } from '@/types/apiResponse';

const login = async (credentials: LoginRequest): Promise<AuthenticationResponse> => {
  const response: ApiResponse<AuthenticationResponse> = await apiClient.post('/User/login', credentials);
  return response.data!;
};

const register = async (data: RegisterRequest): Promise<AuthenticationResponse> => {
  const response: ApiResponse<AuthenticationResponse> = await apiClient.post('/User/register', data);
  return response.data!;
};

const registerAdmin = async (data: RegisterRequest): Promise<AuthenticationResponse> => {
  const response: ApiResponse<AuthenticationResponse> = await apiClient.post('/User/register-admin', data);
  return response.data!;
};

const getCurrentUser = async (): Promise<UserResponse> => {
  const response: ApiResponse<UserResponse> = await apiClient.get('/User/my-profile');
  return response.data!;
};

export const authService = {
  login,
  register,
  registerAdmin,
  getCurrentUser,
};