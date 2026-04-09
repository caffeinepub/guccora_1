import { u as useAuth, b as useNavigate, r as reactExports, j as jsxRuntimeExports, am as User, B as Button, an as doc, ao as db, ap as getDoc, d as ue, aq as setDoc } from "./index-CmX8IV45.js";
import { L as Label, I as Input } from "./label-B90XvOef.js";
import { L as LoaderCircle } from "./loader-circle-D68RVD0K.js";
import { C as Crown } from "./crown-C8Ug2BHu.js";
import { S as Save } from "./save-CJSALdc0.js";
import { S as ShieldCheck } from "./shield-check-TnjWyObt.js";
import { C as CircleCheckBig } from "./circle-check-big-D4e4dwC9.js";
const PLAN_OPTIONS = [
  { value: "599", label: "₹599 — Silver Kit (Starter)" },
  { value: "999", label: "₹999 — Gold Pack (Growth)" },
  { value: "1999", label: "₹1,999 — Platinum Pack (Premium)" },
  { value: "2999", label: "₹2,999 — Diamond Bundle (Elite)" }
];
function ProfilePage() {
  const { userId, isInitializing } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    mobile: "",
    referralId: "",
    plan: "599"
  });
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isInitializing && !userId) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, userId, navigate]);
  reactExports.useEffect(() => {
    if (!userId) return;
    async function fetchProfile() {
      try {
        const docRef = doc(db, "users", userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name ?? "",
            mobile: data.mobile ?? userId ?? "",
            referralId: data.referralCode ?? data.referralId ?? "",
            plan: data.plan ?? "599"
          });
        } else {
          setForm((prev) => ({ ...prev, mobile: userId }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setForm((prev) => ({ ...prev, mobile: userId }));
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);
  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      ue.error("Full name is required");
      return;
    }
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim())) {
      ue.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!form.plan) {
      ue.error("Please select a plan");
      return;
    }
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(
        docRef,
        {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          referralCode: form.referralId.trim() || null,
          plan: form.plan,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        { merge: true }
      );
      ue.success("Profile saved! Welcome to GUCCORA.");
      navigate({ to: "/user-dashboard" });
    } catch (err) {
      console.error("Profile save error:", err);
      ue.error(
        err instanceof Error ? err.message : "Failed to save profile. Try again."
      );
    } finally {
      setIsSaving(false);
    }
  }
  if (isInitializing || isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-7rem)] flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading profile…" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 bg-background relative overflow-hidden py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute inset-0 pointer-events-none overflow-hidden",
        "aria-hidden": true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[100px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-72 h-72 bg-primary/4 rounded-full blur-[80px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-48 h-48 bg-primary/3 rounded-full blur-[60px]" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-elevated overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold tracking-[0.15em] text-foreground uppercase", children: "Complete Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground tracking-[0.1em] mt-1", children: "Set up your account to start earning" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "profile-name",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    "Full Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "profile-name",
                    placeholder: "Your full name",
                    value: form.name,
                    onChange: (e) => updateForm("name", e.target.value),
                    className: "pl-9 bg-background border-input h-11",
                    autoComplete: "name",
                    "data-ocid": "profile-name"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "profile-mobile",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    "Mobile Number ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "profile-mobile",
                  type: "tel",
                  placeholder: "10-digit mobile number",
                  value: form.mobile,
                  onChange: (e) => updateForm(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  ),
                  className: "bg-background border-input h-11",
                  autoComplete: "tel",
                  "data-ocid": "profile-mobile",
                  readOnly: !!userId
                }
              ),
              userId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Mobile number is your login ID and cannot be changed." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "profile-referral",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    "Referral ID",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "(optional)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "profile-referral",
                  placeholder: "Sponsor's referral code",
                  value: form.referralId,
                  onChange: (e) => updateForm("referralId", e.target.value),
                  className: "bg-background border-input h-11",
                  "data-ocid": "profile-referral"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "profile-plan",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    "Select Plan ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "profile-plan",
                  value: form.plan,
                  onChange: (e) => updateForm("plan", e.target.value),
                  className: "w-full bg-background border border-input rounded-md px-3 h-11 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50",
                  "data-ocid": "profile-plan",
                  children: PLAN_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Each plan is a real product purchase — commissions from genuine sales only." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: "w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold rounded-xl transition-smooth shadow-elevated mt-2",
                disabled: isSaving,
                "data-ocid": "profile-submit",
                children: [
                  isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-5 w-5" }),
                  isSaving ? "Saving Profile…" : "Save & Go to Dashboard"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 pt-1", children: [
            { icon: ShieldCheck, label: "Secure Profile" },
            { icon: CircleCheckBig, label: "Free to Join" }
          ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
                label
              ]
            },
            label
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground/60 mt-4", children: "Product Based Network Marketing · Fixed Rupee Commissions Only" })
    ] })
  ] });
}
export {
  ProfilePage as default
};
