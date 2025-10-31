import { User } from './typeEntity';

// Dựa trên DTO/response/users/AuthenticationResponse.cs [cite: 4, 73]
export interface AuthenticationResponse {
  token: string;
  userDetails?: User | null;
}

// Dựa trên DTO/response/library/shelf/AddBookToShelfResponse.cs [cite: 89]
export interface AddBookToShelfResponse {
  success: boolean;
  message: string;
}