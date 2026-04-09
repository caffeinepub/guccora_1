import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  CheckCircle,
  Crown,
  Loader2,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";

const PLAN_OPTIONS = [
  { value: "599", label: "₹599 — Silver Kit (Starter)" },
  { value: "999", label: "₹999 — Gold Pack (Growth)" },
  { value: "1999", label: "₹1,999 — Platinum Pack (Premium)" },
  { value: "2999", label: "₹2,999 — Diamond Bundle (Elite)" },
];

interface ProfileForm {
  name: string;
  mobile: string;
  referralId: string;
  plan: string;
}

export default function ProfilePage() {
  const { userId, isInitializing } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    mobile: "",
    referralId: "",
    plan: "599",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isInitializing && !userId) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, userId, navigate]);

  // Pre-fill from Firestore
  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const docRef = doc(db, "users", userId as string);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as Record<string, string>;
          setForm({
            name: data.name ?? "",
            mobile: data.mobile ?? userId ?? "",
            referralId: data.referralCode ?? data.referralId ?? "",
            plan: data.plan ?? "599",
          });
        } else {
          setForm((prev) => ({ ...prev, mobile: userId as string }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setForm((prev) => ({ ...prev, mobile: userId as string }));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  function updateForm(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim())) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!form.plan) {
      toast.error("Please select a plan");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, "users", userId as string);
      await setDoc(
        docRef,
        {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          referralCode: form.referralId.trim() || null,
          plan: form.plan,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

      toast.success("Profile saved! Welcome to GUCCORA.");
      navigate({ to: "/user-dashboard" });
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save profile. Try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    );
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
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold tracking-[0.15em] text-foreground uppercase">
                  Complete Profile
                </h1>
                <p className="text-xs text-muted-foreground tracking-[0.1em] mt-1">
                  Set up your account to start earning
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="profile-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="pl-9 bg-background border-input h-11"
                    autoComplete="name"
                    data-ocid="profile-name"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-mobile"
                  className="text-sm font-medium text-foreground"
                >
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="profile-mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) =>
                    updateForm(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className="bg-background border-input h-11"
                  autoComplete="tel"
                  data-ocid="profile-mobile"
                  readOnly={!!userId}
                />
                {userId && (
                  <p className="text-xs text-muted-foreground">
                    Mobile number is your login ID and cannot be changed.
                  </p>
                )}
              </div>

              {/* Referral ID */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-referral"
                  className="text-sm font-medium text-foreground"
                >
                  Referral ID{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="profile-referral"
                  placeholder="Sponsor's referral code"
                  value={form.referralId}
                  onChange={(e) => updateForm("referralId", e.target.value)}
                  className="bg-background border-input h-11"
                  data-ocid="profile-referral"
                />
              </div>

              {/* Plan */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-plan"
                  className="text-sm font-medium text-foreground"
                >
                  Select Plan <span className="text-destructive">*</span>
                </Label>
                <select
                  id="profile-plan"
                  value={form.plan}
                  onChange={(e) => updateForm("plan", e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 h-11 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="profile-plan"
                >
                  {PLAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Each plan is a real product purchase — commissions from
                  genuine sales only.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold rounded-xl transition-smooth shadow-elevated mt-2"
                disabled={isSaving}
                data-ocid="profile-submit"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSaving ? "Saving Profile…" : "Save & Go to Dashboard"}
              </Button>
            </form>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { icon: ShieldCheck, label: "Secure Profile" },
                { icon: CheckCircle, label: "Free to Join" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2"
                >
                  <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          Product Based Network Marketing · Fixed Rupee Commissions Only
        </p>
      </div>
    </div>
  );
}
