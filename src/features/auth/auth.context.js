"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "./auth.service";
import { ROUTES } from "@/config/app";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mfaEmail, setMfaEmail] = useState(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(email, password);
      if (data.requireMfa) {
        setMfaEmail(email);
        router.push(ROUTES.mfa);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async ({ name, email, password, role }) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.register({ name, email, password, role });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyMfa = useCallback(async (code) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.verifyMfa(mfaEmail, code);
      setUser(data.user);
      setMfaEmail(null);
      router.push(ROUTES.dashboard);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mfaEmail, router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setMfaEmail(null);
      router.push(ROUTES.login);
    }
  }, [router]);

  const value = {
    user,
    loading,
    error,
    mfaEmail,
    login,
    register,
    verifyMfa,
    logout,
    fetchUser,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
