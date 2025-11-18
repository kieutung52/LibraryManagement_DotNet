import apiClient from './apiClient';
import {
  CreateShelfRequest,
  UpdateShelfRequest,
  AddBookToShelfRequest,
} from '@/types/typeRequest';
import { ShelfLocation, BookOnShelf } from '@/types/typeEntity';
import { ApiResponse, BooleanResponse } from '@/types/apiResponse';
import { AddBookToShelfResponse, RemoveBookFromShelfResponse } from '@/types/typeResponse';

const getAllShelves = async (): Promise<ShelfLocation[]> => {
  const response: ApiResponse<ShelfLocation[]> = await apiClient.get('/Shelf');
  return response.data!;
};

const getShelfById = async (id: number): Promise<ShelfLocation> => {
  const response: ApiResponse<ShelfLocation> = await apiClient.get(`/Shelf/${id}`);
  return response.data!;
};

const createShelf = async (data: CreateShelfRequest): Promise<ShelfLocation> => {
  const response: ApiResponse<ShelfLocation> = await apiClient.post('/Shelf', data);
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

const getBooksByShelf = async (shelfId: number): Promise<BookOnShelf[]> => {
  const response: ApiResponse<BookOnShelf[]> = await apiClient.get(`/Shelf/${shelfId}/books`);
  return response.data!;
};

const removeBookFromShelf = async (bookLocationId: number): Promise<RemoveBookFromShelfResponse> => {
  const response: ApiResponse<RemoveBookFromShelfResponse> = await apiClient.delete(`/Shelf/books/${bookLocationId}`);
  return response.data!;
};

export const shelfService = {
  getAllShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
  addBookToShelf,
  getBooksByShelf,
  removeBookFromShelf,
};