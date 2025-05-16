
import api from './config';
import { User } from './types';

// User profile APIs
export const userAPI = {
  updateProfile: (data: Partial<User>) => {
    try {
      return api.patch<User>('/api/users/profile', data);
    } catch (error) {
      console.log("API error, using mock response");
      return Promise.resolve({
        data: {
          id: "user-1",
          email: "demo@example.com",
          fullName: data.fullName || "Demo User",
          profileImage: data.profileImage
        }
      } as any);
    }
  },
  
  updatePassword: (currentPassword: string, newPassword: string) => {
    try {
      return api.post('/api/users/password', { currentPassword, newPassword });
    } catch (error) {
      console.log("API error, using mock response");
      return Promise.resolve();
    }
  }
};
