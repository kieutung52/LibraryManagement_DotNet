import apiClient from './apiClient';
import {
  CreateShelfRequest,
  UpdateShelfRequest,
  AddBookToShelfRequest,
} from '@/types/typeRequest';
import { ShelfResponse } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';
import { AddBookToShelfResponse } from '@/types/typeResponse';

const getAllShelves = async (): Promise<ShelfResponse[]> => {
  const response: ApiResponse<ShelfResponse[]> = await apiClient.get('/Shelf');
  return response.data!;
};

const getShelfById = async (id: number): Promise<ShelfResponse> => {
  const response: ApiResponse<ShelfResponse> = await apiClient.get(`/Shelf/${id}`);
  return response.data!;
};

const createShelf = async (data: CreateShelfRequest): Promise<ShelfResponse> => {
  const response: ApiResponse<ShelfResponse> = await apiClient.post('/Shelf', data);
  return response.data!;
};

const updateShelf = async (id: number, data: UpdateShelfRequest): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.put(`/Shelf/${id}`, data);
  return response.data!;
};

const deleteShelf = async (id: number): Promise<BooleanResponse> => {
  const response: ApiResponse<BooleanResponse> = await apiClient.delete(`/Shelf/${id}`);
  return response.data!;
};

const addBookToShelf = async (data: AddBookToShelfRequest): Promise<AddBookToShelfResponse> => {
  const response: ApiResponse<AddBookToShelfResponse> = await apiClient.post('/Shelf/add-book', data);
  return response.data!;
};

export const shelfService = {
  getAllShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
  addBookToShelf,
};