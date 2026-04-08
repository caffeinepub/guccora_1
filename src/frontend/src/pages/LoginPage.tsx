import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useLoginUser } from "../hooks/useBackend";

export default function LoginPage() {
  const { login } = useAuth();
  const { mutateAsync: loginUser, isPending } = useLoginUser();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotInfo, setShowForgotInfo] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mobile.trim() || !password.trim()) {
      toast.error("Please enter mobile number and password");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    try {
      const result = await loginUser({ mobile: mobile.trim(), password });
      login(result.userId.toText());
      toast.success("Welcome back to GUCCORA!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Login failed. Check your credentials.",
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 bg-background relative overflow-hidden py-12">
      {/* Decorative background glows */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/4 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/3 rounded-full blur-[60px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
          {/* Gold accent top bar */}
          <div className="h-1 w-full bg-primary" />

          <div className="p-8 space-y-7">
            {/* Branding */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-subtle">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold tracking-[0.2em] text-primary uppercase">
                  GUCCORA
                </h1>
                <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1">
                  Product Based Network Marketing
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="mobile"
                  className="text-sm font-medium text-foreground"
                >
                  Mobile Number
                </Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="pl-9 bg-background border-input h-11"
                    autoComplete="tel"
                    data-ocid="login-mobile"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline transition-colors"
                    onClick={() => setShowForgotInfo(true)}
                    data-ocid="forgot-password-link"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-background border-input h-11"
                    autoComplete="current-password"
                    data-ocid="login-password"
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

              {/* Forgot password info box */}
              {showForgotInfo && (
                <div
                  className="relative bg-muted/50 border border-border rounded-xl p-4 text-sm"
                  data-ocid="forgot-info-box"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowForgotInfo(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-start gap-2.5 pr-4">
                    <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-xs">
                        Password Reset
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Please contact your admin to reset your password. The
                        admin can reset your password from the Admin Panel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold rounded-xl transition-smooth shadow-elevated mt-2"
                disabled={isPending}
                data-ocid="login-submit"
              >
                <LogIn className="h-5 w-5" />
                {isPending ? "Signing in…" : "Login to GUCCORA"}
              </Button>
            </form>

            {/* Income reminder */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground mb-2">
                Your earning potential:
              </p>
              {[
                "₹40 direct income per referral sale",
                "₹5 × 10 levels — level income",
                "₹3 pair income per team match",
              ].map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            {/* Register link */}
            <div className="border-t border-border pt-5 text-center">
              <p className="text-xs text-muted-foreground">
                New to GUCCORA?{" "}
                <Link
                  to="/"
                  className="text-primary font-semibold hover:underline transition-colors"
                  data-ocid="login-register-link"
                >
                  Register for free
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Outer footer note */}
        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          Product Based Network Marketing · Fixed Rupee Commissions Only
        </p>
      </div>
    </div>
  );
}
