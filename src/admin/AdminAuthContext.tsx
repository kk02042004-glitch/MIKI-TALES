import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
}

interface AdminAuthContextType {
  token: string | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const TOKEN_KEY = 'mk_tales_admin_auth_token_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Authenticated fetch helper that injects Bearer token
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const currentToken = token || localStorage.getItem(TOKEN_KEY);
    const headers = new Headers(options.headers || {});
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            setAdminUser(json.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.warn('Could not verify admin session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Invalid email or password.');
        setIsLoading(false);
        return false;
      }

      setToken(json.token);
      setAdminUser(json.user);
      localStorage.setItem(TOKEN_KEY, json.token);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Login connection failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const currentToken = token || localStorage.getItem(TOKEN_KEY);
    if (currentToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      } catch (e) {
        // Continue clearing client state regardless
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdminUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        error,
        login,
        logout,
        clearError,
        authFetch,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
