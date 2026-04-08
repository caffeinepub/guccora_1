import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Shield,
  ShoppingBag,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMyProfile } from "../hooks/useBackend";

const USER_NAV_LINKS = [
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/withdraw", label: "Withdraw", icon: Wallet },
];

const ADMIN_NAV_LINKS = [{ to: "/admin", label: "Admin Panel", icon: Shield }];

function NavLink({
  to,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth
        ${
          active
            ? "text-primary bg-primary/10 border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which nav links to show
  const navLinks = isAdmin
    ? ADMIN_NAV_LINKS
    : isAuthenticated
      ? USER_NAV_LINKS
      : [];

  // Don't show header on admin page (admin has its own layout)
  const isAdminPage = currentPath === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      {!isAdminPage && (
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
          <div className="container flex h-14 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav-logo"
            >
              <span className="text-xl font-display font-bold tracking-widest text-primary uppercase select-none">
                GUCCORA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              data-ocid="nav-desktop"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  icon={link.icon}
                  active={currentPath === link.to}
                />
              ))}
            </nav>

            {/* Desktop Auth */}
            <div
              className="hidden md:flex items-center gap-3"
              data-ocid="nav-auth"
            >
              {(isAuthenticated || isAdmin) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground truncate max-w-[120px]">
                    {isAdmin ? "Admin" : (profile?.name ?? "User")}
                  </span>
                </div>
              )}

              {isAuthenticated || isAdmin ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                  data-ocid="nav-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  asChild
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="nav-login"
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                  data-ocid="nav-mobile-trigger"
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 bg-card border-l border-border p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Sheet Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <span className="text-lg font-display font-bold tracking-widest text-primary uppercase">
                      GUCCORA
                    </span>
                  </div>

                  {/* Mobile Nav Links */}
                  <nav
                    className="flex flex-col gap-1 px-4 py-4 flex-1"
                    data-ocid="nav-mobile"
                  >
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        label={link.label}
                        icon={link.icon}
                        active={currentPath === link.to}
                        onClick={() => setMobileOpen(false)}
                      />
                    ))}
                    {!isAuthenticated && !isAdmin && (
                      <NavLink
                        to="/login"
                        label="Login"
                        icon={LogIn}
                        active={currentPath === "/login"}
                        onClick={() => setMobileOpen(false)}
                      />
                    )}
                  </nav>

                  {/* Mobile Auth */}
                  <div
                    className="px-4 py-4 border-t border-border"
                    data-ocid="nav-mobile-auth"
                  >
                    {(isAuthenticated || isAdmin) && (
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">
                            {isAdmin
                              ? "Administrator"
                              : (profile?.name ?? "User")}
                          </span>
                          {isAdmin && (
                            <span className="text-xs text-primary">
                              Admin Account
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {isAuthenticated || isAdmin ? (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        data-ocid="nav-mobile-logout"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    ) : (
                      <Button
                        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        asChild
                        data-ocid="nav-mobile-login"
                      >
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          <LogIn className="h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-background" data-ocid="main-content">
        {children}
      </main>

      {/* Footer — hidden on admin page */}
      {!isAdminPage && (
        <footer
          className="bg-card border-t border-border py-4"
          data-ocid="footer"
        >
          <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-sm font-display font-semibold tracking-widest text-primary uppercase">
              GUCCORA
            </span>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-200"
              >
                Built with love using caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link
                to="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="hover:text-primary transition-colors duration-200"
              >
                Products
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
