"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthState } from "../types/auth";
import { getToken, setToken as saveToken, clearToken } from "../lib/auth";
import { loginUser, registerCitizen, getMe } from "../lib/api";

interface AuthContextType extends AuthState {
  login: (identifier: string, pass: string) => Promise<User>;
  register: (data: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    address?: string;
    ward?: string;
    preferred_language?: string;
  }) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session once on mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      setTokenState(storedToken);
      try {
        const userData = await getMe();
        if (isMounted) {
          setUser(userData);
        }
      } catch (err) {
        // Token invalid or expired
        console.warn("Session expired or invalid, clearing stored credentials.");
        clearToken();
        if (isMounted) {
          setUser(null);
          setTokenState(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (identifier: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await loginUser(identifier.trim(), pass.trim());
      saveToken(data.access_token);
      setTokenState(data.access_token);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (registerData: {
      full_name: string;
      email: string;
      phone: string;
      password: string;
      confirm_password: string;
      address?: string;
      ward?: string;
      preferred_language?: string;
    }): Promise<User> => {
      setIsLoading(true);
      try {
        const data = await registerCitizen(registerData);
        saveToken(data.access_token);
        setTokenState(data.access_token);
        setUser(data.user);
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTokenState(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
