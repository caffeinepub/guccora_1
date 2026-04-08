import { c as createLucideIcon, u as useAuth, e as useLoginUser, b as useNavigate, r as reactExports, j as jsxRuntimeExports, X, B as Button, f as LogIn, L as Link, d as ue } from "./index-DkPdwGpA.js";
import { L as Label, I as Input } from "./label-BAUUdq56.js";
import { S as ShieldCheck } from "./shield-check-CDzcvyKA.js";
import { E as EyeOff, a as Eye } from "./eye-B7dH1rNt.js";
import { S as Sparkles } from "./sparkles-ctiW7giO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
function LoginPage() {
  const { login } = useAuth();
  const { mutateAsync: loginUser, isPending } = useLoginUser();
  const navigate = useNavigate();
  const [mobile, setMobile] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showForgotInfo, setShowForgotInfo] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!mobile.trim() || !password.trim()) {
      ue.error("Please enter mobile number and password");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      ue.error("Enter a valid 10-digit mobile number");
      return;
    }
    try {
      const result = await loginUser({ mobile: mobile.trim(), password });
      login(result.userId.toText());
      ue.success("Welcome back to GUCCORA!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Login failed. Check your credentials."
      );
    }
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold tracking-[0.2em] text-primary uppercase", children: "GUCCORA" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1", children: "Product Based Network Marketing" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "mobile",
                  className: "text-sm font-medium text-foreground",
                  children: "Mobile Number"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "mobile",
                    type: "tel",
                    placeholder: "10-digit mobile number",
                    value: mobile,
                    onChange: (e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)),
                    className: "pl-9 bg-background border-input h-11",
                    autoComplete: "tel",
                    "data-ocid": "login-mobile"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "password",
                    className: "text-sm font-medium text-foreground",
                    children: "Password"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-primary hover:underline transition-colors",
                    onClick: () => setShowForgotInfo(true),
                    "data-ocid": "forgot-password-link",
                    children: "Forgot Password?"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    placeholder: "Enter your password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "pr-10 bg-background border-input h-11",
                    autoComplete: "current-password",
                    "data-ocid": "login-password"
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
            showForgotInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative bg-muted/50 border border-border rounded-xl p-4 text-sm",
                "data-ocid": "forgot-info-box",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "absolute top-2 right-2 text-muted-foreground hover:text-foreground",
                      onClick: () => setShowForgotInfo(false),
                      "aria-label": "Close",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 pr-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-xs", children: "Password Reset" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Please contact your admin to reset your password. The admin can reset your password from the Admin Panel." })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: "w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold rounded-xl transition-smooth shadow-elevated mt-2",
                disabled: isPending,
                "data-ocid": "login-submit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-5 w-5" }),
                  isPending ? "Signing in…" : "Login to GUCCORA"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-xl p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-2", children: "Your earning potential:" }),
            [
              "₹40 direct income per referral sale",
              "₹5 × 10 levels — level income",
              "₹3 pair income per team match"
            ].map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
                  feat
                ]
              },
              feat
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border pt-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "New to GUCCORA?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "text-primary font-semibold hover:underline transition-colors",
                "data-ocid": "login-register-link",
                children: "Register for free"
              }
            )
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground/60 mt-4", children: "Product Based Network Marketing · Fixed Rupee Commissions Only" })
    ] })
  ] });
}
export {
  LoginPage as default
};
