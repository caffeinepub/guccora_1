import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  CheckCircle,
  Crown,
  Eye,
  EyeOff,
  Gift,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useRegisterUser } from "../hooks/useBackend";

const INCOME_FEATURES = [
  {
    icon: Gift,
    label: "Direct Income",
    value: "₹40",
    desc: "Per referral product sale",
    color: "text-primary",
  },
  {
    icon: Network,
    label: "Level Income",
    value: "₹5 × 10",
    desc: "Up to 10 levels deep",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    label: "Pair Income",
    value: "₹3",
    desc: "Per team match",
    color: "text-primary",
  },
];

const PRODUCTS = [
  {
    name: "Silver Kit",
    price: "₹599",
    tier: "Starter",
    icon: Star,
    features: ["Direct Income", "Level 1–3", "Pair Bonus"],
  },
  {
    name: "Gold Pack",
    price: "₹999",
    tier: "Growth",
    icon: Crown,
    features: ["Direct Income", "Level 1–5", "Pair Bonus"],
  },
  {
    name: "Platinum Pack",
    price: "₹1,999",
    tier: "Premium",
    icon: Zap,
    features: ["Direct Income", "Level 1–7", "Pair Bonus"],
  },
  {
    name: "Diamond Bundle",
    price: "₹2,999",
    tier: "Elite",
    icon: Award,
    features: ["Direct Income", "All 10 Levels", "Pair Bonus"],
  },
];

export default function HomePage() {
  const { login } = useAuth();
  const { mutateAsync: registerUser, isPending } = useRegisterUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    position: "left",
  });
  const [showPassword, setShowPassword] = useState(false);

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const { name, mobile, password, confirmPassword, referralCode, position } =
      form;

    if (!name.trim() || !mobile.trim() || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const user = await registerUser({
        name: name.trim(),
        mobile: mobile.trim(),
        password,
        referralCode: referralCode.trim() || null,
        position: position as "left" | "right",
      });
      // user.id is already a string (mobile number) — no .toText() needed
      login(user.id, "user");
      toast.success(
        "Welcome to GUCCORA! Complete your profile to get started.",
      );
      navigate({ to: "/profile" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed. Try again.",
      );
    }
  }

  return (
    <div className="bg-background">
      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border min-h-[85vh] flex items-center">
        {/* Hero image background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/guccora-hero.dim_1200x600.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-card via-card/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Decorative glows */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Brand badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/40 rounded-full px-5 py-2 text-primary text-xs font-bold tracking-[0.2em] uppercase shadow-elevated">
                <Sparkles className="h-3.5 w-3.5" />
                Product Based Network Marketing
              </div>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-widest text-primary uppercase">
                GUCCORA
              </h1>
              <p className="text-lg md:text-2xl font-display font-medium text-foreground/80 tracking-[0.15em] uppercase">
                Premium Product Network
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Earn real commissions from genuine product purchases. No joining
                fees. No pyramid schemes. Just real products and fixed rupee
                rewards.
              </p>
            </div>

            {/* Income quick view */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                {
                  label: "Direct ₹40",
                  color: "bg-primary/15 text-primary border-primary/30",
                },
                {
                  label: "Level ₹5×10",
                  color: "bg-primary/15 text-primary border-primary/30",
                },
                {
                  label: "Pair ₹3",
                  color: "bg-primary/15 text-primary border-primary/30",
                },
                {
                  label: "Max ₹93/order",
                  color:
                    "bg-primary/20 text-primary border-primary/40 font-bold",
                },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${color}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl h-14 px-8 text-base font-bold shadow-elevated transition-smooth"
                onClick={() =>
                  document
                    .getElementById("register-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero-register-cta"
              >
                <UserPlus className="h-5 w-5" />
                Join GUCCORA Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 gap-2 rounded-xl h-14 px-8 text-base font-semibold transition-smooth"
                asChild
                data-ocid="hero-login-cta"
              >
                <Link to="/login">Already a Member? Login</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* ─── PRODUCT BASED NETWORK MARKETING Banner ─────────────── */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex items-center justify-center gap-6 flex-wrap px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary-foreground flex-shrink-0" />
            <span className="text-primary-foreground font-bold tracking-[0.2em] uppercase text-sm md:text-base">
              Product Based Network Marketing
            </span>
            <ShieldCheck className="h-5 w-5 text-primary-foreground flex-shrink-0" />
          </div>
          <div className="hidden sm:flex items-center gap-3 text-primary-foreground/80 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" />
            All Commissions From Real Product Sales
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" />
            No Recruitment Fees
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" />
            100% Legal
          </div>
        </div>
      </section>

      {/* ─── How You Earn Section ────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4">
              Income Structure
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              How You <span className="text-primary">Earn</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Fixed rupee commissions on every product sale — no percentages, no
              ambiguity, no surprises
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            {INCOME_FEATURES.map(({ icon: Icon, label, value, desc }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-smooth group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-smooth relative z-10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-primary mb-1 relative z-10">
                  {value}
                </p>
                <p className="text-sm font-semibold text-foreground relative z-10">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 relative z-10">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-3 text-sm text-primary font-bold shadow-subtle">
              <Award className="h-5 w-5 flex-shrink-0" />
              <span>
                Total maximum payout:{" "}
                <span className="text-primary underline underline-offset-2">
                  ₹93 per order
                </span>{" "}
                — capped for legal compliance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products Section ────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4">
              Product Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Our <span className="text-primary">Products</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Each plan is a real product purchase — commissions are only earned
              from genuine sales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {PRODUCTS.map(({ name, price, tier, icon: Icon, features }) => (
              <div
                key={name}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-smooth group flex flex-col"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center mb-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                    {tier}
                  </span>
                  <p className="text-2xl font-display font-bold text-primary mt-1">
                    {price}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {name}
                  </p>
                </div>
                <ul className="space-y-2 mt-auto">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl h-12 px-8 font-semibold transition-smooth"
              onClick={() =>
                document
                  .getElementById("register-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="products-register-cta"
            >
              <UserPlus className="h-5 w-5" />
              Register & Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Registration Section ────────────────────────────────── */}
      <section
        id="register-section"
        className="py-16 bg-background relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[80px]" />
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4">
                Join Now
              </Badge>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Create Your <span className="text-primary">Account</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Register and start earning from real product sales today
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-7 shadow-elevated">
              {/* Header accent */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    New Member Registration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Free to join — no membership fee
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="bg-background h-11"
                    data-ocid="reg-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-mobile" className="text-sm font-medium">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reg-mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.mobile}
                    onChange={(e) =>
                      updateForm(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    className="bg-background h-11"
                    autoComplete="tel"
                    data-ocid="reg-mobile"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password" className="text-sm font-medium">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      className="pr-10 bg-background h-11"
                      data-ocid="reg-password"
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

                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm" className="text-sm font-medium">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateForm("confirmPassword", e.target.value)
                    }
                    className="bg-background h-11"
                    data-ocid="reg-confirm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-referral" className="text-sm font-medium">
                    Referral Code{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="reg-referral"
                    placeholder="Sponsor's referral code"
                    value={form.referralCode}
                    onChange={(e) => updateForm("referralCode", e.target.value)}
                    className="bg-background h-11"
                    data-ocid="reg-referral"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-position" className="text-sm font-medium">
                    Position <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="reg-position"
                    value={form.position}
                    onChange={(e) => updateForm("position", e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 h-11 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    data-ocid="reg-position"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold rounded-xl gap-2 mt-2 text-base shadow-elevated transition-smooth"
                  disabled={isPending}
                  data-ocid="reg-submit"
                >
                  <UserPlus className="h-5 w-5" />
                  {isPending ? "Creating Account…" : "Register & Start Earning"}
                </Button>
              </form>

              <div className="mt-5 pt-5 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                    data-ocid="reg-login-link"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                { icon: ShieldCheck, label: "Product-Based Only" },
                { icon: CheckCircle, label: "No Joining Fees" },
                { icon: Award, label: "Fixed Commissions" },
                { icon: Sparkles, label: "Admin-Verified Orders" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2"
                >
                  <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Compliance Footer Banner ────────────────────────────── */}
      <section className="py-8 bg-muted/40 border-t border-border">
        <div className="container px-4 md:px-6 text-center">
          <div className="inline-flex items-start gap-3 text-xs text-muted-foreground max-w-2xl mx-auto">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-left leading-relaxed">
              GUCCORA is a{" "}
              <strong className="text-foreground">
                product-based network marketing
              </strong>{" "}
              platform. All commissions are generated strictly from real product
              purchases — never from recruitment fees, joining fees, or
              membership charges. Total commission payout is capped at ₹93 per
              order to ensure sustainable and legal operation.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
