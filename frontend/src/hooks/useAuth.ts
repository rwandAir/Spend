import { useState, useCallback } from 'react';
import { authService } from '../services/api';

/**
 * Hook for authentication operations
 * Provides methods for login, register, logout, and password reset
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
        return { success: false, error: result.error };
      }
      // Store user info in localStorage
      localStorage.setItem('sw_user_id', String(result.user_id));
      localStorage.setItem('sw_user_name', String(result.name));
      localStorage.setItem('sw_user_role', String(result.role));
      localStorage.setItem('sw_balance', String(result.balance ?? 0));
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(name, email, password);
      if (!result.success) {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error };
      }
      // Store user info in localStorage
      localStorage.setItem('sw_user_id', String(result.user_id));
      localStorage.setItem('sw_user_name', String(result.name));
      localStorage.setItem('sw_user_role', String(result.role));
      localStorage.setItem('sw_balance', String(result.balance ?? 0));
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.logout();
      if (!result.success) {
        setError(result.error || 'Logout failed');
        return result;
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Logout failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.requestPasswordReset(email);
      if (!result.success) {
        setError(result.error || 'Password reset request failed');
        return result;
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Password reset request failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.updatePassword(newPassword);
      if (!result.success) {
        setError(result.error || 'Password update failed');
        return result;
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Password update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    login,
    register,
    logout,
    requestPasswordReset,
    updatePassword,
    clearError,
  };
};

export default useAuth;
