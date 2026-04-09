import { c as createLucideIcon, u as useAuth, z as useAdminLogin, b as useNavigate, r as reactExports, j as jsxRuntimeExports, A as Shield, B as Button, d as ue } from "./index-CmX8IV45.js";
import { L as Label, I as Input } from "./label-B90XvOef.js";
import { E as EyeOff, a as Eye } from "./eye-DCJRALKj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const { mutateAsync: adminLogin, isPending } = useAdminLogin();
  const navigate = useNavigate();
  const [adminId, setAdminId] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      ue.error("Please enter Admin ID and password");
      return;
    }
    try {
      await adminLogin({ adminId: adminId.trim(), password });
      loginAdmin(adminId.trim(), password);
      ue.success("Admin login successful — welcome back.");
      navigate({ to: "/admin-dashboard" });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Invalid admin credentials"
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
          "Secure Admin Access"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-display font-bold tracking-[0.2em] text-primary uppercase", children: "ADMIN PANEL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 tracking-wider uppercase", children: "GUCCORA Administration" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-elevated overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-primary" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "adminId",
                  className: "text-sm font-semibold text-foreground",
                  children: "Admin ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "adminId",
                  type: "text",
                  placeholder: "Enter your Admin ID",
                  value: adminId,
                  onChange: (e) => setAdminId(e.target.value),
                  className: "bg-background border-input h-11 font-mono",
                  autoComplete: "username",
                  "data-ocid": "admin-login-id"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "adminPassword",
                  className: "text-sm font-semibold text-foreground",
                  children: "Password"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "adminPassword",
                    type: showPassword ? "text" : "password",
                    placeholder: "Enter admin password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "pr-10 bg-background border-input h-11",
                    autoComplete: "current-password",
                    "data-ocid": "admin-login-password"
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold rounded-xl gap-2 text-base transition-smooth shadow-elevated",
                disabled: isPending,
                "data-ocid": "admin-login-submit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }),
                  isPending ? "Authenticating…" : "Access Admin Panel"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border border-border rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "This is a secure area. Unauthorized access attempts are logged. Admin access is strictly restricted to authorized personnel only." })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center mt-5 text-xs text-muted-foreground/40", children: "GUCCORA Administration Portal · Authorized Access Only" })
    ] })
  ] });
}
export {
  AdminLoginPage as default
};
