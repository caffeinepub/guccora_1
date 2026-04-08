import {
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "guccora_auth";

interface StoredAuth {
  userId: string | null;
  isAdmin: boolean;
}

interface AuthContextValue {
  userId: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (userId: string) => void;
  loginAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userId: null, isAdmin: false };
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed;
  } catch {
    return { userId: null, isAdmin: false };
  }
}

function writeStorage(data: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredAuth>({
    userId: null,
    isAdmin: false,
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const stored = readStorage();
    setState(stored);
    setIsInitializing(false);
  }, []);

  const login = useCallback((userId: string) => {
    const next: StoredAuth = { userId, isAdmin: false };
    writeStorage(next);
    setState(next);
  }, []);

  const loginAdmin = useCallback(() => {
    const next: StoredAuth = { userId: null, isAdmin: true };
    writeStorage(next);
    setState(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ userId: null, isAdmin: false });
  }, []);

  const value: AuthContextValue = {
    userId: state.userId,
    isAdmin: state.isAdmin,
    isAuthenticated: !!state.userId && !state.isAdmin,
    isInitializing,
    login,
    loginAdmin,
    logout,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
