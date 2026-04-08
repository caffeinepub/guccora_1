import { c as createLucideIcon, u as useAuth, b as useNavigate, r as reactExports, i as useMyProfile, k as useMyWallet, l as useMyReferralCode, m as useDirectDownline, n as useDownlineTree, o as useMyOrders, p as useMyNotifications, q as useMarkNotificationRead, j as jsxRuntimeExports, B as Button, S as Skeleton, s as ShoppingBag, W as Wallet, L as Link, d as ue, O as OrderStatus } from "./index-DkPdwGpA.js";
import { B as Badge } from "./badge-CMWW19U5.js";
import { C as Card, a as CardHeader, c as CardTitle, b as CardContent } from "./card-Breo0Ly3.js";
import { U as Users, C as ChartColumn, B as Bell, a as ChevronUp, b as ChevronDown } from "./users-bZxkLZK5.js";
import { T as TrendingUp } from "./trending-up-BEOpwFWI.js";
import { C as Copy } from "./copy-BY0NUzRT.js";
import { C as Clock } from "./clock-CJZcT-Cu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
];
const GitBranch = createLucideIcon("git-branch", __iconNode);
function formatRupees(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  const d = new Date(ms);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatRelative(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatTimestamp(ts);
}
function orderStatusConfig(status) {
  switch (status) {
    case OrderStatus.approved:
      return {
        label: "Approved",
        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      };
    case OrderStatus.rejected:
      return {
        label: "Rejected",
        className: "bg-destructive/15 text-destructive border-destructive/30"
      };
    default:
      return {
        label: "Pending Approval",
        className: "bg-amber-500/15 text-amber-400 border-amber-500/30"
      };
  }
}
function IncomeCard({
  label,
  value,
  icon: Icon,
  description,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border border-border hover:border-primary/30 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: description })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-28 mt-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-primary mt-1", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
  ] }) });
}
function OrderRow({ order }) {
  const { label, className } = orderStatusConfig(order.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/20 transition-smooth",
      "data-ocid": `order-row-${order.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground truncate", children: [
            "Product #",
            String(order.planId)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Order #",
            String(order.id),
            " · ",
            formatTimestamp(order.timestamp)
          ] }),
          order.status === OrderStatus.rejected && order.rejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive mt-0.5 truncate", children: [
            "Reason: ",
            order.rejectionReason
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: formatRupees(order.planPrice) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs ${className}`, children: label })
        ] })
      ]
    }
  );
}
function NotificationItem({
  notification,
  onMarkRead
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => !notification.isRead && onMarkRead(notification.id),
      className: `w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 border transition-smooth group ${notification.isRead ? "bg-card border-border opacity-70" : "bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/8 cursor-pointer"}`,
      "data-ocid": `notification-item-${notification.id}`,
      "aria-label": notification.isRead ? notification.message : `Mark as read: ${notification.message}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-0.5", children: notification.isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full bg-primary/80 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary-foreground" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-sm leading-snug ${notification.isRead ? "text-muted-foreground" : "text-foreground font-medium"}`,
              children: notification.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: formatRelative(notification.timestamp) })
        ] }),
        !notification.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "flex-shrink-0 bg-primary/20 text-primary border-primary/30 text-[10px] self-start", children: "New" })
      ]
    }
  );
}
function TreeNodeBox({ node, depth = 0 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `px-3 py-1.5 rounded-lg border text-xs font-medium min-w-[80px] text-center truncate max-w-[100px] ${depth === 0 ? "bg-primary/15 border-primary/40 text-primary" : "bg-muted/50 border-border text-foreground"}`,
        title: node.name,
        children: node.name
      }
    ),
    node.children.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-border" }),
      node.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-1 mt-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3 bg-border mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNodeBox, { node: child, depth: depth + 1 })
          ]
        },
        child.user.toText()
      ))
    ] })
  ] });
}
function DashboardPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const [teamExpanded, setTeamExpanded] = reactExports.useState(false);
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: referralCode, isLoading: refLoading } = useMyReferralCode();
  const { data: downline, isLoading: downlineLoading } = useDirectDownline();
  const { data: tree } = useDownlineTree();
  const { data: orders } = useMyOrders();
  const { data: notifications, isLoading: notifLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const sortedNotifications = reactExports.useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [notifications]);
  const unreadCount = reactExports.useMemo(
    () => sortedNotifications.filter((n) => !n.isRead).length,
    [sortedNotifications]
  );
  if (!profileLoading && isAuthenticated && !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-7rem)] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Complete Your Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You're connected! Now set up your GUCCORA account to start earning commissions." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold rounded-xl",
          onClick: () => navigate({ to: "/" }),
          "data-ocid": "dashboard-register-cta",
          children: [
            "Create Your Account",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
          ]
        }
      )
    ] }) });
  }
  const referralLink = referralCode ? `${window.location.origin}/?ref=${referralCode}` : "";
  const copyReferral = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      ue.success("Referral link copied!");
    }
  };
  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };
  const hasBalance = wallet && wallet.balance > 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-[calc(100vh-7rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Welcome back," }),
          (profile == null ? void 0 : profile.isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-xs", children: "Admin" })
        ] }),
        profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-display font-bold text-foreground", children: (profile == null ? void 0 : profile.name) ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => navigate({ to: "/products" }),
            className: "gap-1.5",
            "data-ocid": "dashboard-buy-plan",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
              "Buy Plan"
            ]
          }
        ),
        hasBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5",
            onClick: () => navigate({ to: "/withdraw" }),
            "data-ocid": "dashboard-withdraw",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
              "Withdraw"
            ]
          }
        ),
        (profile == null ? void 0 : profile.isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => navigate({ to: "/admin" }),
            className: "gap-1.5 border-primary/30 text-primary",
            "data-ocid": "dashboard-admin-link",
            children: "Admin Panel"
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/25 rounded-2xl p-5 relative overflow-hidden shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Commission Wallet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: "Earned from referrals & team sales" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-primary" }) })
        ] }),
        walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-44 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-display font-bold text-primary mt-1 relative", children: wallet ? formatRupees(wallet.balance) : "₹0.00" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: "Available for Withdrawal" }),
        hasBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/withdraw",
            className: "text-xs text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1",
            "data-ocid": "wallet-withdraw-link",
            children: [
              "Withdraw funds ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncomeCard,
          {
            label: "Direct Income",
            value: wallet ? formatRupees(wallet.directIncome) : "₹0.00",
            icon: TrendingUp,
            description: "₹40 per referral",
            loading: walletLoading
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncomeCard,
          {
            label: "Level Income",
            value: wallet ? formatRupees(wallet.levelIncome) : "₹0.00",
            icon: ChartColumn,
            description: "₹5 × 10 levels",
            loading: walletLoading
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncomeCard,
          {
            label: "Pair Income",
            value: wallet ? formatRupees(wallet.pairIncome) : "₹0.00",
            icon: Users,
            description: "₹3 per pair",
            loading: walletLoading
          }
        )
      ] }),
      wallet && wallet.totalIncome > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Total Income Earned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary text-lg", children: formatRupees(wallet.totalIncome) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your Referral Link" }),
          referralCode && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "border-primary/30 text-primary font-mono text-xs",
              children: referralCode
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 pb-4", children: [
          refLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-ocid": "referral-link-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                readOnly: true,
                value: referralLink,
                className: "flex-1 bg-background border border-input rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono truncate focus:outline-none",
                "data-ocid": "referral-link-input",
                "aria-label": "Referral link"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: copyReferral,
                className: "gap-1.5 flex-shrink-0 border-primary/30 text-primary hover:bg-primary/10",
                "data-ocid": "referral-copy-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
                  "Copy"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Share this link to earn ₹40 direct commission when someone purchases a plan." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Direct Referrals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: (downline == null ? void 0 : downline.length) ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "team members" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "My Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: (orders == null ? void 0 : orders.length) ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "product purchases" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/20 border-t border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-foreground", children: "My Orders" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/products",
            className: "text-xs text-primary hover:underline font-medium flex items-center gap-1",
            children: [
              "Buy More ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
            ]
          }
        )
      ] }),
      orders && orders.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "orders-list", children: orders.slice().sort((a, b) => Number(b.timestamp - a.timestamp)).slice(0, 6).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderRow, { order }, String(order.id))) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 border border-dashed border-border rounded-xl",
          "data-ocid": "orders-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "No orders yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: "Purchase a plan to start earning commissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-primary text-primary-foreground hover:bg-primary/90",
                onClick: () => navigate({ to: "/products" }),
                "data-ocid": "orders-empty-cta",
                children: "Browse Plans"
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background border-t border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between mb-4",
          "data-ocid": "notifications-header",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-foreground", children: "Notifications" }),
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full",
                  "data-ocid": "notifications-unread-badge",
                  children: unreadCount
                }
              )
            ] }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click to mark as read" })
          ]
        }
      ),
      notifLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) }) : sortedNotifications.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "notifications-list", children: sortedNotifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        NotificationItem,
        {
          notification: n,
          onMarkRead: handleMarkRead
        },
        String(n.id)
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 border border-dashed border-border rounded-xl",
          "data-ocid": "notifications-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-7 w-7 mx-auto mb-2 text-muted-foreground opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "No notifications yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Admin announcements and updates will appear here" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/20 border-t border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full flex items-center justify-between mb-4 group",
          onClick: () => setTeamExpanded((v) => !v),
          "aria-expanded": teamExpanded,
          "data-ocid": "team-section-toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-foreground", children: "My Team" }),
              downline && downline.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/15 text-primary border-primary/20 text-xs", children: downline.length })
            ] }),
            teamExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" })
          ]
        }
      ),
      teamExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in-0 duration-200", children: [
        downlineLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) }) : downline && downline.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium", children: "Direct Referrals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: downline.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3",
              "data-ocid": "team-member-row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: member.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: member.referralCode })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: formatRupees(member.totalIncome) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "earned" })
                ] })
              ]
            },
            member.id.toText()
          )) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-8 border border-dashed border-border rounded-xl",
            "data-ocid": "team-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 mx-auto mb-2 text-muted-foreground opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No direct referrals yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Share your referral link to grow your team" })
            ]
          }
        ),
        tree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Team Structure" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-4 overflow-x-auto",
              "data-ocid": "team-tree",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center min-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNodeBox, { node: tree }) })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  DashboardPage as default
};
