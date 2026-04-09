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

type Role = "user" | "admin" | null;

interface StoredAuth {
  userId: string | null;
  isAdmin: boolean;
  adminId: string | null;
  adminPassword: string | null;
  role: Role;
}

interface AuthContextValue {
  userId: string | null;
  isAdmin: boolean;
  adminId: string | null;
  adminPassword: string | null;
  role: Role;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (userId: string, role?: Role) => void;
  loginAdmin: (adminId: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        userId: null,
        isAdmin: false,
        adminId: null,
        adminPassword: null,
        role: null,
      };
    const parsed = JSON.parse(raw) as StoredAuth;
    // Backward compat: older stored data may not have role field
    if (!parsed.role) {
      if (parsed.isAdmin) parsed.role = "admin";
      else if (parsed.userId) parsed.role = "user";
      else parsed.role = null;
    }
    return parsed;
  } catch {
    return {
      userId: null,
      isAdmin: false,
      adminId: null,
      adminPassword: null,
      role: null,
    };
  }
}

function writeStorage(data: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredAuth>({
    userId: null,
    isAdmin: false,
    adminId: null,
    adminPassword: null,
    role: null,
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const stored = readStorage();
    setState(stored);
    setIsInitializing(false);
  }, []);

  const login = useCallback((userId: string, role: Role = "user") => {
    const next: StoredAuth = {
      userId,
      isAdmin: false,
      adminId: null,
      adminPassword: null,
      role: role ?? "user",
    };
    writeStorage(next);
    setState(next);
  }, []);

  const loginAdmin = useCallback((adminId: string, password: string) => {
    const next: StoredAuth = {
      userId: null,
      isAdmin: true,
      adminId,
      adminPassword: password,
      role: "admin",
    };
    writeStorage(next);
    setState(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      userId: null,
      isAdmin: false,
      adminId: null,
      adminPassword: null,
      role: null,
    });
  }, []);

  const value: AuthContextValue = {
    userId: state.userId,
    isAdmin: state.role === "admin",
    adminId: state.adminId,
    adminPassword: state.adminPassword,
    role: state.role,
    // isAuthenticated = any logged-in session (user or admin)
    isAuthenticated: !!state.userId && state.role === "user",
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
