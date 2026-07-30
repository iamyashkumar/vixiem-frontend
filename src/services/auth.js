import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  async register(email, password, username) {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        username,
      });

      const { user } = response.data;
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { user } = response.data;
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const isUnverified = error.response?.data?.error === 'EMAIL_NOT_VERIFIED';
      if (!isUnverified) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
      }
      throw error;
    }
  },

  async loginWithGoogle(credential) {
    try {
      const response = await api.post('/api/auth/google', {
        credential,
      });

      toast.success('Google Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Google Login failed';
      toast.error(message);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout failed:', e);
    }
    window.dispatchEvent(new Event('auth:logout'));
    toast.success('Logged out successfully');
  },

  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async fetchCsrf() {
    await api.get('/api/auth/csrf');
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/api/auth/profile/password', {
        currentPassword,
        newPassword,
      });
      toast.success(response.data.message || 'Password updated successfully. Please log in again.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update password';
      toast.error(message);
      throw error;
    }
  },

  async updateUsername(username) {
    try {
      const response = await api.put('/api/auth/profile/username', { username });
      toast.success('Username updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update username';
      toast.error(message);
      throw error;
    }
  },

  async verifyEmail(token) {
    try {
      const response = await api.get(`/api/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteAccount() {
    try {
      const response = await api.delete('/api/auth/profile');
      toast.success(response.data.message || 'Account deleted successfully.');
      window.dispatchEvent(new Event('auth:logout'));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete account';
      toast.error(message);
      throw error;
    }
  },

  async resendVerification(email) {
    try {
      const response = await api.post('/api/auth/resend-verification', { email });
      toast.success('Verification email sent!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send verification email';
      toast.error(message);
      throw error;
    }
  }
};

export default authService;