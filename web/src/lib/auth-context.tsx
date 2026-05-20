"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ApiError, authApi, clearToken, getToken, setToken } from "./api";
import type { ApiUser } from "./types";

type AuthState = {
  user: ApiUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    headline?: string;
  }) => Promise<ApiUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    status: "loading",
  });

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({ user: null, status: "unauthenticated" });
      return;
    }
    try {
      const { user } = await authApi.me();
      setState({ user, status: "authenticated" });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken();
      }
      setState({ user: null, status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    // Bootstrap auth from the cookie/storage on mount — this *is* syncing with an
    // external system (HTTP cookie + remote /me), exactly the use case the React docs
    // allow for setState-in-effect. The new lint rule is a false positive here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    setToken(token);
    setState({ user, status: "authenticated" });
    return user;
  }, []);

  const register = useCallback<AuthContextValue["register"]>(async (input) => {
    const { user, token } = await authApi.register(input);
    setToken(token);
    setState({ user, status: "authenticated" });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore — token may already be expired
    }
    clearToken();
    setState({ user: null, status: "unauthenticated" });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout, refresh }),
    [state, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
