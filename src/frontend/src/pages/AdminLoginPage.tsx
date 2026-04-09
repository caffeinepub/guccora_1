import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAdminLogin } from "../hooks/useBackend";

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const { mutateAsync: adminLogin, isPending } = useAdminLogin();
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      toast.error("Please enter Admin ID and password");
      return;
    }
    try {
      await adminLogin({ adminId: adminId.trim(), password });
      loginAdmin(adminId.trim(), password);
      toast.success("Admin login successful — welcome back.");
      navigate({ to: "/admin-dashboard" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Invalid admin credentials",
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 bg-background relative overflow-hidden py-12">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* ADMIN PANEL heading above card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <Lock className="h-3.5 w-3.5" />
            Secure Admin Access
          </div>
          <h1 className="text-4xl font-display font-bold tracking-[0.2em] text-primary uppercase">
            ADMIN PANEL
          </h1>
          <p className="text-xs text-muted-foreground mt-2 tracking-wider uppercase">
            GUCCORA Administration
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
          {/* Accent bar — slightly different pattern to distinguish from user login */}
          <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

          <div className="p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="adminId"
                  className="text-sm font-semibold text-foreground"
                >
                  Admin ID
                </Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Enter your Admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="bg-background border-input h-11 font-mono"
                  autoComplete="username"
                  data-ocid="admin-login-id"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="adminPassword"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-background border-input h-11"
                    autoComplete="current-password"
                    data-ocid="admin-login-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold rounded-xl gap-2 text-base transition-smooth shadow-elevated"
                disabled={isPending}
                data-ocid="admin-login-submit"
              >
                <Shield className="h-5 w-5" />
                {isPending ? "Authenticating…" : "Access Admin Panel"}
              </Button>
            </form>

            {/* Security notice */}
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a secure area. Unauthorized access attempts are
                  logged. Admin access is strictly restricted to authorized
                  personnel only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle back link — low visibility by design */}
        <p className="text-center mt-5 text-xs text-muted-foreground/40">
          GUCCORA Administration Portal · Authorized Access Only
        </p>
      </div>
    </div>
  );
}
