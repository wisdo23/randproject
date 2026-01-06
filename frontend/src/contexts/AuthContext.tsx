import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  userEmail: string | null;
  userPicture: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "randlottery_token";

type DecodedClaims = {
  email?: string;
  picture?: string;
};

function extractClaims(token: string | null): DecodedClaims | null {
  if (!token) {
    return null;
  }
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalized.length % 4)) % 4;
    const padded = normalized.padEnd(normalized.length + padding, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as DecodedClaims;
  } catch (_error) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPicture, setUserPicture] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setToken(stored);
      const claims = extractClaims(stored);
      setUserEmail(claims?.email ?? null);
      setUserPicture(claims?.picture ?? null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    userEmail,
    userPicture,
    login: (newToken: string) => {
      window.localStorage.setItem(STORAGE_KEY, newToken);
      setToken(newToken);
      const claims = extractClaims(newToken);
      setUserEmail(claims?.email ?? null);
      setUserPicture(claims?.picture ?? null);
    },
    logout: () => {
      window.localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUserEmail(null);
      setUserPicture(null);
    },
  }), [token, userEmail, userPicture]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(STORAGE_KEY);
}
