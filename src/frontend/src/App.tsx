import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/useAuth";

// Lazy page imports
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const WithdrawPage = lazy(() => import("./pages/WithdrawPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function PageLoader() {
  return (
    <div className="container px-4 py-12 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Root layout route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster richColors theme="dark" position="top-right" />
    </Layout>
  ),
});

// Index route — redirect based on auth state
function IndexRedirect() {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (isAdmin) {
      navigate({ to: "/admin" });
    } else if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
    // else stay on home
  }, [isAuthenticated, isAdmin, isInitializing, navigate]);

  if (isInitializing) return <PageLoader />;
  return <HomePage />;
}

function LoginRedirect() {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (isAdmin) {
      navigate({ to: "/admin" });
    } else if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isAdmin, isInitializing, navigate]);

  if (isInitializing) return <PageLoader />;
  return <LoginPage />;
}

function ProtectedRoute({
  component: Component,
}: { component: React.ComponentType }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing || !isAuthenticated) return <PageLoader />;
  return <Component />;
}

function AdminRoute() {
  const { isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAdmin) {
      navigate({ to: "/admin-login" });
    }
  }, [isAdmin, isInitializing, navigate]);

  if (isInitializing || !isAdmin) return <PageLoader />;
  return <AdminPage />;
}

function AdminLoginRedirect() {
  const { isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (isAdmin) navigate({ to: "/admin" });
  }, [isAdmin, isInitializing, navigate]);

  if (isInitializing) return <PageLoader />;
  return <AdminLoginPage />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRedirect,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: () => <ProtectedRoute component={ProductsPage} />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <ProtectedRoute component={DashboardPage} />,
});

const withdrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/withdraw",
  component: () => <ProtectedRoute component={WithdrawPage} />,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginRedirect,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  productsRoute,
  dashboardRoute,
  withdrawRoute,
  adminLoginRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
