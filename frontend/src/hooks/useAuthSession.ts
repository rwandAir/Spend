import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string;
}

/**
 * Hook for managing authentication session state
 * Manages session via Django backend with localStorage fallback
 */
export const useAuthSession = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    userRole: 'user',
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check localStorage for existing session
        const userId = localStorage.getItem('sw_user_id');
        const userName = localStorage.getItem('sw_user_name');
        const userRole = localStorage.getItem('sw_user_role') || 'user';
        
        if (userId) {
          setAuthState({
            user: {
              id: userId,
              name: userName,
              role: userRole,
            },
            loading: false,
            error: null,
            isAuthenticated: true,
            userRole: userRole,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            userRole: 'user',
          });
        }
      } catch (err: any) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to initialize auth',
        }));
      }
    };

    initializeAuth();
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: authState.isAuthenticated,
    userRole: authState.userRole,
    clearError,
  };
};

export default useAuthSession;
