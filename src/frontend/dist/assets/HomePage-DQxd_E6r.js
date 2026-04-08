import { c as createLucideIcon, u as useAuth, a as useRegisterUser, b as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, L as Link, d as ue } from "./index-DkPdwGpA.js";
import { B as Badge } from "./badge-CMWW19U5.js";
import { L as Label, I as Input } from "./label-BAUUdq56.js";
import { S as Sparkles } from "./sparkles-ctiW7giO.js";
import { S as ShieldCheck } from "./shield-check-CDzcvyKA.js";
import { T as TrendingUp } from "./trending-up-BEOpwFWI.js";
import { S as Star, C as Crown, Z as Zap } from "./zap-BLWc1AcG.js";
import { C as CircleCheckBig } from "./circle-check-big-igsDz5Us.js";
import { E as EyeOff, a as Eye } from "./eye-B7dH1rNt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
];
const Network = createLucideIcon("network", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
const INCOME_FEATURES = [
  {
    icon: Gift,
    label: "Direct Income",
    value: "₹40",
    desc: "Per referral product sale",
    color: "text-primary"
  },
  {
    icon: Network,
    label: "Level Income",
    value: "₹5 × 10",
    desc: "Up to 10 levels deep",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    label: "Pair Income",
    value: "₹3",
    desc: "Per team match",
    color: "text-primary"
  }
];
const PRODUCTS = [
  {
    name: "Silver Kit",
    price: "₹599",
    tier: "Starter",
    icon: Star,
    features: ["Direct Income", "Level 1–3", "Pair Bonus"]
  },
  {
    name: "Gold Pack",
    price: "₹999",
    tier: "Growth",
    icon: Crown,
    features: ["Direct Income", "Level 1–5", "Pair Bonus"]
  },
  {
    name: "Platinum Pack",
    price: "₹1,999",
    tier: "Premium",
    icon: Zap,
    features: ["Direct Income", "Level 1–7", "Pair Bonus"]
  },
  {
    name: "Diamond Bundle",
    price: "₹2,999",
    tier: "Elite",
    icon: Award,
    features: ["Direct Income", "All 10 Levels", "Pair Bonus"]
  }
];
function HomePage() {
  const { login } = useAuth();
  const { mutateAsync: registerUser, isPending } = useRegisterUser();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });
  const [showPassword, setShowPassword] = reactExports.useState(false);
  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleRegister(e) {
    e.preventDefault();
    const { name, mobile, password, confirmPassword, referralCode } = form;
    if (!name.trim() || !mobile.trim() || !password) {
      ue.error("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      ue.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      ue.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      ue.error("Passwords do not match");
      return;
    }
    try {
      const user = await registerUser({
        name: name.trim(),
        mobile: mobile.trim(),
        password,
        referralCode: referralCode.trim() || null
      });
      login(user.id.toText());
      ue.success("Welcome to GUCCORA! Your account is ready.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Registration failed. Try again."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-card border-b border-border min-h-[85vh] flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/generated/guccora-hero.dim_1200x600.jpg",
            alt: "",
            "aria-hidden": true,
            className: "w-full h-full object-cover opacity-20"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-card via-card/80 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", "aria-hidden": true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[80px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container px-4 md:px-6 py-16 md:py-24 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto text-center space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/15 border border-primary/40 rounded-full px-5 py-2 text-primary text-xs font-bold tracking-[0.2em] uppercase shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          "Product Based Network Marketing"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-7xl font-display font-bold tracking-widest text-primary uppercase", children: "GUCCORA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-2xl font-display font-medium text-foreground/80 tracking-[0.15em] uppercase", children: "Premium Product Network" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "Earn real commissions from genuine product purchases. No joining fees. No pyramid schemes. Just real products and fixed rupee rewards." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-3", children: [
          {
            label: "Direct ₹40",
            color: "bg-primary/15 text-primary border-primary/30"
          },
          {
            label: "Level ₹5×10",
            color: "bg-primary/15 text-primary border-primary/30"
          },
          {
            label: "Pair ₹3",
            color: "bg-primary/15 text-primary border-primary/30"
          },
          {
            label: "Max ₹93/order",
            color: "bg-primary/20 text-primary border-primary/40 font-bold"
          }
        ].map(({ label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${color}`,
            children: label
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl h-14 px-8 text-base font-bold shadow-elevated transition-smooth",
              onClick: () => {
                var _a;
                return (_a = document.getElementById("register-section")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
              },
              "data-ocid": "hero-register-cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
                "Join GUCCORA Free"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              variant: "outline",
              className: "border-primary/40 text-primary hover:bg-primary/10 gap-2 rounded-xl h-14 px-8 text-base font-semibold transition-smooth",
              asChild: true,
              "data-ocid": "hero-login-cta",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Already a Member? Login" })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent z-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary py-4 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-6 flex-wrap px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-foreground flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-bold tracking-[0.2em] uppercase text-sm md:text-base", children: "Product Based Network Marketing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-foreground flex-shrink-0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 text-primary-foreground/80 text-xs font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" }),
        "All Commissions From Real Product Sales",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" }),
        "No Recruitment Fees",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" }),
        "100% Legal"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4", children: "Income Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold text-foreground mb-3", children: [
          "How You ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Earn" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto", children: "Fixed rupee commissions on every product sale — no percentages, no ambiguity, no surprises" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8", children: INCOME_FEATURES.map(({ icon: Icon, label, value, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-smooth group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-smooth relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-primary mb-1 relative z-10", children: value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground relative z-10", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5 relative z-10", children: desc })
          ]
        },
        label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2.5 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-3 text-sm text-primary font-bold shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total maximum payout:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary underline underline-offset-2", children: "₹93 per order" }),
          " ",
          "— capped for legal compliance"
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-muted/30 border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4", children: "Product Plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold text-foreground mb-3", children: [
          "Our ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Products" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto", children: "Each plan is a real product purchase — commissions are only earned from genuine sales" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto", children: PRODUCTS.map(({ name, price, tier, icon: Icon, features }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-smooth group flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold tracking-widest uppercase text-muted-foreground", children: tier }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-primary mt-1", children: price }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mt-0.5", children: name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 mt-auto", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
                  f
                ]
              },
              f
            )) })
          ]
        },
        name
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl h-12 px-8 font-semibold transition-smooth",
          onClick: () => {
            var _a;
            return (_a = document.getElementById("register-section")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          },
          "data-ocid": "products-register-cta",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
            "Register & Get Started"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "register-section",
        className: "py-16 bg-background relative overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", "aria-hidden": true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[80px]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container px-4 md:px-6 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border border-primary/30 text-xs tracking-widest uppercase px-3 py-1 mb-4", children: "Join Now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-display font-bold text-foreground mb-2", children: [
                "Create Your ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Account" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Register and start earning from real product sales today" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-7 shadow-elevated", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 pb-5 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "New Member Registration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Free to join — no membership fee" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-name", className: "text-sm font-medium", children: [
                    "Full Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-name",
                      placeholder: "Your full name",
                      value: form.name,
                      onChange: (e) => updateForm("name", e.target.value),
                      className: "bg-background h-11",
                      "data-ocid": "reg-name"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-mobile", className: "text-sm font-medium", children: [
                    "Mobile Number ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-mobile",
                      type: "tel",
                      placeholder: "10-digit mobile number",
                      value: form.mobile,
                      onChange: (e) => updateForm(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      ),
                      className: "bg-background h-11",
                      autoComplete: "tel",
                      "data-ocid": "reg-mobile"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-password", className: "text-sm font-medium", children: [
                    "Password ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "reg-password",
                        type: showPassword ? "text" : "password",
                        placeholder: "Minimum 6 characters",
                        value: form.password,
                        onChange: (e) => updateForm("password", e.target.value),
                        className: "pr-10 bg-background h-11",
                        "data-ocid": "reg-password"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                        onClick: () => setShowPassword(!showPassword),
                        "aria-label": showPassword ? "Hide password" : "Show password",
                        children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-confirm", className: "text-sm font-medium", children: [
                    "Confirm Password ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-confirm",
                      type: "password",
                      placeholder: "Re-enter your password",
                      value: form.confirmPassword,
                      onChange: (e) => updateForm("confirmPassword", e.target.value),
                      className: "bg-background h-11",
                      "data-ocid": "reg-confirm"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-referral", className: "text-sm font-medium", children: [
                    "Referral Code",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "(optional)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-referral",
                      placeholder: "Sponsor's referral code",
                      value: form.referralCode,
                      onChange: (e) => updateForm("referralCode", e.target.value),
                      className: "bg-background h-11",
                      "data-ocid": "reg-referral"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold rounded-xl gap-2 mt-2 text-base shadow-elevated transition-smooth",
                    disabled: isPending,
                    "data-ocid": "reg-submit",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
                      isPending ? "Creating Account…" : "Register & Start Earning"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-5 border-t border-border text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/login",
                    className: "text-primary font-semibold hover:underline",
                    "data-ocid": "reg-login-link",
                    children: "Login here"
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-2", children: [
              { icon: ShieldCheck, label: "Product-Based Only" },
              { icon: CircleCheckBig, label: "No Joining Fees" },
              { icon: Award, label: "Fixed Commissions" },
              { icon: Sparkles, label: "Admin-Verified Orders" }
            ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
                  label
                ]
              },
              label
            )) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-8 bg-muted/40 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container px-4 md:px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-start gap-3 text-xs text-muted-foreground max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-left leading-relaxed", children: [
        "GUCCORA is a",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "product-based network marketing" }),
        " ",
        "platform. All commissions are generated strictly from real product purchases — never from recruitment fees, joining fees, or membership charges. Total commission payout is capped at ₹93 per order to ensure sustainable and legal operation."
      ] })
    ] }) }) })
  ] });
}
export {
  HomePage as default
};
