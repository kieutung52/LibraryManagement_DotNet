export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface BooleanResponse {
  is_successed: boolean;
}
