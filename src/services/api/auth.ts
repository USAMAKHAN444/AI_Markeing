
import api from './config';
import { User, AuthResponse } from './types';

// Mock users for development
const mockUsers = [
  { 
    id: "user-1",
    email: "demo@example.com", 
    password: "password123", 
    fullName: "Demo User" 
  },
  { 
    id: "user-2",
    email: "test@example.com", 
    password: "test123", 
    fullName: "Test User" 
  }
];

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.log("API error, using mock data instead");
      // Mock login for development
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        return Promise.reject(new Error("Invalid credentials"));
      }
      
      const mockResponse = {
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName
          },
          token: "mock-jwt-token"
        }
      };
      
      return mockResponse as any;
    }
  },
  
  register: async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { email, password, fullName });
      return response;
    } catch (error) {
      console.log("API error, using mock data instead");
      // Check if email already exists in mock users
      if (mockUsers.some(u => u.email === email)) {
        return Promise.reject(new Error("Email already in use"));
      }
      
      // Mock register for development
      const newUser = {
        id: `user-${mockUsers.length + 1}`,
        email,
        password,
        fullName
      };
      
      mockUsers.push(newUser);
      
      const mockResponse = {
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName
          },
          token: "mock-jwt-token"
        }
      };
      
      return mockResponse as any;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.log("API error, using mock response");
      // Always return success for security reasons
      return Promise.resolve();
    }
  },
    
  resetPassword: async (token: string, newPassword: string) => {
    try {
      return await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      console.log("API error, using mock response");
      if (token !== "valid-token") {
        return Promise.reject(new Error("Invalid or expired token"));
      }
      return Promise.resolve();
    }
  },
    
  getCurrentUser: async () => {
    try {
      return await api.get<User>('/auth/me');
    } catch (error) {
      console.log("API error, using mock data");
      const token = localStorage.getItem('token');
      if (!token) {
        return Promise.reject(new Error("No token found"));
      }
      
      // Mock response
      return {
        data: {
          id: "user-1",
          email: "demo@example.com",
          fullName: "Demo User"
        }
      } as any;
    }
  }
};
