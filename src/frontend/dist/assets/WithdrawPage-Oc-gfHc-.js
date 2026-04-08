import { c as createLucideIcon, u as useAuth, b as useNavigate, k as useMyWallet, t as useGetMyPaymentDetails, v as useMyWithdrawals, w as useRequestWithdrawal, r as reactExports, x as WithdrawStatus, j as jsxRuntimeExports, W as Wallet, S as Skeleton, B as Button, d as ue, y as useSavePaymentDetails } from "./index-DkPdwGpA.js";
import { B as Badge } from "./badge-CMWW19U5.js";
import { C as Card, a as CardHeader, c as CardTitle, b as CardContent } from "./card-Breo0Ly3.js";
import { L as Label, I as Input } from "./label-BAUUdq56.js";
import { C as Clock } from "./clock-CJZcT-Cu.js";
import { S as ShieldCheck } from "./shield-check-CDzcvyKA.js";
import { L as LoaderCircle } from "./loader-circle-Ci_5PL9z.js";
import { C as CircleCheckBig } from "./circle-check-big-igsDz5Us.js";
import { C as CircleX } from "./circle-x-Bl3XlCvB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function formatRupees(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function maskAccount(account) {
  if (account.length <= 4) return account;
  return `••••${account.slice(-4)}`;
}
function StatusBadge({ status }) {
  if (status === WithdrawStatus.approved) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border-primary/30 gap-1 text-xs font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
      "Approved"
    ] });
  }
  if (status === WithdrawStatus.rejected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "destructive",
        className: "gap-1 text-xs font-semibold opacity-90",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
          "Rejected"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: "border-primary/30 text-primary gap-1 text-xs font-semibold",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
        "Pending"
      ]
    }
  );
}
function PaymentDetailsSection() {
  const { data: paymentDetails, isLoading } = useGetMyPaymentDetails();
  const { mutateAsync: savePaymentDetails, isPending: isSaving } = useSavePaymentDetails();
  const [editMode, setEditMode] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("bank");
  const [accountNumber, setAccountNumber] = reactExports.useState("");
  const [ifsc, setIfsc] = reactExports.useState("");
  const [accountHolderName, setAccountHolderName] = reactExports.useState("");
  const [upiId, setUpiId] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (paymentDetails && !editMode) {
      if (paymentDetails.bankDetails) {
        setAccountNumber(paymentDetails.bankDetails.accountNumber);
        setIfsc(paymentDetails.bankDetails.ifsc);
        setAccountHolderName(paymentDetails.bankDetails.accountHolderName);
        setActiveTab("bank");
      }
      if (paymentDetails.upiId) {
        setUpiId(paymentDetails.upiId);
        if (!paymentDetails.bankDetails) setActiveTab("upi");
      }
    }
  }, [paymentDetails, editMode]);
  const hasPaymentMethod = !!((paymentDetails == null ? void 0 : paymentDetails.bankDetails) || (paymentDetails == null ? void 0 : paymentDetails.upiId));
  function validate() {
    const e = {};
    if (activeTab === "bank") {
      if (!accountNumber.trim()) e.accountNumber = "Account number is required";
      else if (!/^\d{9,18}$/.test(accountNumber.trim()))
        e.accountNumber = "Enter a valid account number (9–18 digits)";
      if (!ifsc.trim()) e.ifsc = "IFSC code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc.trim()))
        e.ifsc = "Enter a valid IFSC code (e.g. SBIN0001234)";
      if (!accountHolderName.trim())
        e.accountHolderName = "Account holder name is required";
    } else {
      if (!upiId.trim()) e.upiId = "UPI ID is required";
      else if (!upiId.includes("@"))
        e.upiId = "Enter a valid UPI ID (e.g. name@bank)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSave() {
    if (!validate()) return;
    try {
      if (activeTab === "bank") {
        const bank = {
          accountNumber: accountNumber.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          accountHolderName: accountHolderName.trim()
        };
        await savePaymentDetails({ bankDetails: bank, upiId: null });
      } else {
        await savePaymentDetails({ bankDetails: null, upiId: upiId.trim() });
      }
      ue.success("Payment details saved successfully!");
      setEditMode(false);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save. Try again."
      );
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
      ] })
    ] });
  }
  const showForm = editMode || !hasPaymentMethod;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/60 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
        "Payment Method"
      ] }),
      hasPaymentMethod && !editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setEditMode(true),
          className: "flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-smooth font-medium",
          "aria-label": "Edit payment method",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
            "Edit"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
      hasPaymentMethod && !editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-2", children: [
        (paymentDetails == null ? void 0 : paymentDetails.bankDetails) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: paymentDetails.bankDetails.accountHolderName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "A/C: ",
              maskAccount(paymentDetails.bankDetails.accountNumber),
              " ",
              "· ",
              paymentDetails.bankDetails.ifsc
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-primary/10 text-primary border-primary/20 text-xs shrink-0", children: "Bank" })
        ] }),
        (paymentDetails == null ? void 0 : paymentDetails.upiId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "UPI ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: paymentDetails.upiId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-primary/10 text-primary border-primary/20 text-xs shrink-0", children: "UPI" })
        ] })
      ] }),
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex rounded-xl overflow-hidden border border-border bg-muted/30 p-1 gap-1",
            role: "tablist",
            children: [
              {
                id: "bank",
                icon: Banknote,
                label: "Bank Account"
              },
              {
                id: "upi",
                icon: CreditCard,
                label: "UPI ID"
              }
            ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                role: "tab",
                "aria-selected": activeTab === tab.id,
                type: "button",
                onClick: () => {
                  setActiveTab(tab.id);
                  setErrors({});
                },
                className: `flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-smooth ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `payment-tab-${tab.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { className: "h-3.5 w-3.5" }),
                  tab.label
                ]
              },
              tab.id
            ))
          }
        ),
        activeTab === "bank" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "accountHolderName",
                className: "text-sm font-medium",
                children: [
                  "Account Holder Name",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "accountHolderName",
                placeholder: "Full name as on bank account",
                value: accountHolderName,
                onChange: (e) => {
                  setAccountHolderName(e.target.value);
                  if (errors.accountHolderName)
                    setErrors((p) => ({ ...p, accountHolderName: "" }));
                },
                className: "bg-background border-input h-11 rounded-lg",
                "data-ocid": "bank-account-holder"
              }
            ),
            errors.accountHolderName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.accountHolderName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "accountNumber",
                className: "text-sm font-medium",
                children: [
                  "Account Number ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "accountNumber",
                placeholder: "Enter bank account number",
                value: accountNumber,
                onChange: (e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ""));
                  if (errors.accountNumber)
                    setErrors((p) => ({ ...p, accountNumber: "" }));
                },
                className: "bg-background border-input h-11 rounded-lg font-mono",
                "data-ocid": "bank-account-number"
              }
            ),
            errors.accountNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.accountNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "ifsc", className: "text-sm font-medium", children: [
              "IFSC Code ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "ifsc",
                placeholder: "e.g. SBIN0001234",
                value: ifsc,
                onChange: (e) => {
                  setIfsc(e.target.value.toUpperCase());
                  if (errors.ifsc) setErrors((p) => ({ ...p, ifsc: "" }));
                },
                className: "bg-background border-input h-11 rounded-lg font-mono tracking-wider",
                "data-ocid": "bank-ifsc"
              }
            ),
            errors.ifsc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.ifsc })
          ] })
        ] }),
        activeTab === "upi" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "upiId", className: "text-sm font-medium", children: [
            "UPI ID ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "upiId",
              placeholder: "e.g. yourname@upi or 9876543210@ybl",
              value: upiId,
              onChange: (e) => {
                setUpiId(e.target.value);
                if (errors.upiId) setErrors((p) => ({ ...p, upiId: "" }));
              },
              className: "bg-background border-input h-11 rounded-lg",
              "data-ocid": "upi-id-input"
            }
          ),
          errors.upiId ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.upiId }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter your UPI ID linked to your bank account" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSave,
              disabled: isSaving,
              className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold rounded-xl transition-smooth",
              "data-ocid": "save-payment-details",
              children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
                "Saving…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
                "Save Payment Details"
              ] })
            }
          ),
          editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => {
                setEditMode(false);
                setErrors({});
              },
              className: "h-11 px-4 rounded-xl border-border",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function WithdrawPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: paymentDetails, isLoading: paymentLoading } = useGetMyPaymentDetails();
  const { data: withdrawals, isLoading: withdrawalsLoading } = useMyWithdrawals();
  const { mutateAsync: requestWithdrawal, isPending } = useRequestWithdrawal();
  const [amount, setAmount] = reactExports.useState("");
  const [amountError, setAmountError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const balance = wallet ? Number(wallet.balance) : 0;
  const hasPaymentMethod = !!((paymentDetails == null ? void 0 : paymentDetails.bankDetails) || (paymentDetails == null ? void 0 : paymentDetails.upiId));
  function validateAmount(val) {
    if (!val) return "Amount is required";
    const n = Number.parseFloat(val);
    if (Number.isNaN(n) || n <= 0) return "Amount must be greater than 0";
    if (!Number.isInteger(n)) return "Amount must be a whole number";
    if (n < 100) return "Minimum withdrawal amount is ₹100";
    if (n > balance)
      return `Amount exceeds available balance (${wallet ? formatRupees(wallet.balance) : "₹0"})`;
    return "";
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!hasPaymentMethod) return;
    const error = validateAmount(amount);
    if (error) {
      setAmountError(error);
      return;
    }
    const amountNum = Number.parseFloat(amount);
    try {
      await requestWithdrawal(BigInt(Math.round(amountNum)));
      ue.success("Withdrawal request submitted. Awaiting admin approval.");
      setAmount("");
      setAmountError("");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Request failed. Please try again."
      );
    }
  }
  const pendingCount = (withdrawals == null ? void 0 : withdrawals.filter((w) => w.status === WithdrawStatus.pending).length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-[calc(100vh-7rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-3xl mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Withdraw Earnings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Transfer commissions to your bank account or UPI" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-3xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/25 rounded-2xl p-5 relative overflow-hidden shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Available Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5 text-primary opacity-70" })
        ] }),
        walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-40 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-display font-bold text-primary mt-1 relative", children: wallet ? formatRupees(wallet.balance) : "₹0.00" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: "Commission earnings available for withdrawal" }),
        pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-xs text-primary font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
          pendingCount,
          " pending request",
          pendingCount > 1 ? "s" : ""
        ] }),
        wallet && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40", children: [
          { label: "Direct", value: wallet.directIncome },
          { label: "Level", value: wallet.levelIncome },
          { label: "Pair", value: wallet.pairIncome }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-bold text-primary mt-0.5", children: formatRupees(item.value) })
        ] }, item.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentDetailsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/60 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-primary" }),
          "Request Withdrawal"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
          !paymentLoading && !hasPaymentMethod && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4",
              "data-ocid": "no-payment-method-warning",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "Please add your bank account or UPI ID above before requesting a withdrawal." })
              ]
            }
          ),
          balance <= 0 && !walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 mx-auto text-muted-foreground opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your balance is ₹0.00. Earn commissions by referring others to GUCCORA." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => navigate({ to: "/products" }),
                className: "mt-2",
                children: "Browse Plans"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSubmit,
              className: "space-y-4",
              "data-ocid": "withdraw-form",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "amount", className: "text-sm font-medium", children: [
                    "Amount (₹) ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "amount",
                      type: "number",
                      min: "100",
                      step: "1",
                      placeholder: "Minimum ₹100",
                      value: amount,
                      onChange: (e) => {
                        setAmount(e.target.value);
                        if (amountError) setAmountError("");
                      },
                      onBlur: () => {
                        if (amount) setAmountError(validateAmount(amount));
                      },
                      className: "bg-background border-input h-11 rounded-lg",
                      disabled: !hasPaymentMethod,
                      "data-ocid": "withdraw-amount",
                      "aria-describedby": amountError ? "amount-error" : "amount-hint"
                    }
                  ),
                  amountError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "amount-error", className: "text-xs text-destructive", children: amountError }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      id: "amount-hint",
                      className: "text-xs text-muted-foreground",
                      children: wallet ? `Minimum ₹100 · Max: ${formatRupees(wallet.balance)} · Whole numbers only` : "Enter the amount to withdraw"
                    }
                  )
                ] }),
                wallet && wallet.balance >= 100n && hasPaymentMethod && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                  [25, 50, 100].map((pct) => {
                    const quickAmt = Math.floor(balance * pct / 100);
                    if (quickAmt < 100) return null;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth",
                        onClick: () => {
                          setAmount(String(quickAmt));
                          setAmountError("");
                        },
                        children: [
                          pct,
                          "% (₹",
                          quickAmt.toLocaleString("en-IN"),
                          ")"
                        ]
                      },
                      pct
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth",
                      onClick: () => {
                        setAmount(String(balance));
                        setAmountError("");
                      },
                      children: [
                        "Max (₹",
                        balance.toLocaleString("en-IN"),
                        ")"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold rounded-xl transition-smooth text-base",
                    disabled: isPending || !amount || walletLoading || balance < 100 || !hasPaymentMethod,
                    "data-ocid": "withdraw-submit",
                    children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
                      "Submitting…"
                    ] }) : !hasPaymentMethod ? "Add Payment Method First" : "Request Withdrawal"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Withdrawals are processed manually by admin. Allow 1–3 business days." })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-foreground mb-3", children: "Withdrawal History" }),
        withdrawalsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) }) : withdrawals && withdrawals.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: withdrawals.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/20 transition-smooth",
            "data-ocid": `withdrawal-row-${req.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatRupees(req.amount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(
                      Number(req.requestedAt) / 1e6
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }) }),
                    req.processedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "· Processed",
                      " ",
                      new Date(
                        Number(req.processedAt) / 1e6
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status }) })
            ]
          },
          String(req.id)
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-10 border border-dashed border-border rounded-xl",
            "data-ocid": "withdrawals-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "No withdrawal requests yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Your withdrawal history will appear here" })
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  WithdrawPage as default
};
