import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserResponse } from '../types/typeEntity'; // Sửa: Dùng UserResponse
import { authService } from '../services/deployment/authService'; // Sửa: Dùng service thật
import { LoginRequest } from '@/types/typeRequest';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>; // Sửa: Dùng service thật
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Thêm: Để xử lý tải trang
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sửa: Xác thực token khi tải trang
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Gọi API để lấy thông tin user mới nhất
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } catch (error) {
          console.error("Auth init failed:", error);
          // Token hỏng, đăng xuất
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      // Sửa: Gọi API login thật
      const response = await authService.login(credentials);
      const { token: newToken, userDetails } = response;

      if (!userDetails || !newToken) {
        throw new Error("Login response is missing token or user details.");
      }

      setUser(userDetails);
      setToken(newToken);
      localStorage.setItem('currentUser', JSON.stringify(userDetails));
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Ném lỗi để form login xử lý
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !isLoading && !!user,
    isAdmin: !isLoading && user?.role === 'ADMIN',
    isLoading,
  }), [user, token, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
