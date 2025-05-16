
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, User } from '../services/api';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // For now, we'll simulate a successful login
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(email, password, fullName);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
      toast({
        title: "Password reset initiated",
        description: "If the email exists in our system, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      // Still show success message for security reasons
      toast({
        title: "Password reset initiated",
        description: "If the email exists in our system, you will receive password reset instructions.",
      });
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authAPI.resetPassword(token, newPassword);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Password reset failed",
        description: "The reset link may have expired. Please request a new one.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      forgotPassword,
      resetPassword,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
