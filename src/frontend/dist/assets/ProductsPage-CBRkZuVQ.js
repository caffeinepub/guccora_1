import { c as createLucideIcon, g as useGetProducts, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button, h as usePurchasePlan, b as useNavigate, d as ue } from "./index-CmX8IV45.js";
import { B as Badge } from "./badge-BivFuWFV.js";
import { C as Card, a as CardHeader, b as CardContent } from "./card-D0lzvxAE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, M as MapPin, U as Upload } from "./dialog-BZLPKByR.js";
import { L as Label, I as Input } from "./label-B90XvOef.js";
import { C as Crown } from "./crown-C8Ug2BHu.js";
import { S as Star, Z as Zap } from "./zap-01DC_tgO.js";
import { C as Copy } from "./copy-ZFIy-ZE3.js";
import { L as LoaderCircle } from "./loader-circle-D68RVD0K.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
      key: "1f1r0c"
    }
  ]
];
const Diamond = createLucideIcon("diamond", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode);
const PRODUCT_META = {
  Silver: {
    icon: Zap,
    badge: "Starter Kit",
    features: [
      "Real product access",
      "Direct ₹40 per referral",
      "Level income eligible"
    ],
    highlight: false
  },
  Gold: {
    icon: Star,
    badge: "Growth Pack",
    features: [
      "Real product access",
      "Direct ₹40 per referral",
      "Level income eligible"
    ],
    highlight: false
  },
  Platinum: {
    icon: Crown,
    badge: "Premium Pack",
    features: [
      "Premium product access",
      "Direct ₹40 per referral",
      "Pair income eligible"
    ],
    highlight: true
  },
  Diamond: {
    icon: Diamond,
    badge: "Elite Bundle",
    features: [
      "Elite product access",
      "Direct ₹40 per referral",
      "Max pair income ₹3"
    ],
    highlight: true
  }
};
function getProductMeta(name) {
  return PRODUCT_META[name] ?? {
    icon: Star,
    badge: "Member Pack",
    features: ["Product access", "Commission eligible"],
    highlight: false
  };
}
const EMPTY_ADDRESS = {
  fullName: "",
  mobile: "",
  street: "",
  city: "",
  state: "",
  pincode: ""
};
function buildAddressJson(a) {
  return JSON.stringify(a);
}
function isAddressComplete(a) {
  return Object.values(a).every((v) => v.trim().length > 0);
}
function StepIndicator({ current, total }) {
  const labels = ["Address", "Payment", "Upload"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: Array.from({ length: total }, (_, i) => {
    const step = i + 1;
    const done = step < current;
    const active = step === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-smooth ${done ? "bg-primary border-primary text-primary-foreground" : active ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`,
            children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : step
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-[10px] font-medium ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`,
            children: labels[i]
          }
        )
      ] }),
      step < total && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex-1 h-0.5 mx-2 mt-[-18px] ${done ? "bg-primary" : "bg-border"}`
        }
      )
    ] }, step);
  }) });
}
function AddressStep({
  address,
  onChange,
  onNext
}) {
  function handleNext(e) {
    e.preventDefault();
    if (!isAddressComplete(address)) {
      ue.error("Please fill in all address fields");
      return;
    }
    if (!/^\d{10}$/.test(address.mobile.trim())) {
      ue.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      ue.error("Enter a valid 6-digit pincode");
      return;
    }
    onNext();
  }
  const field = (id, label, placeholder, type = "text", inputMode) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: id, className: "text-sm font-medium text-foreground", children: [
      label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        type,
        inputMode,
        placeholder,
        value: address[id],
        onChange: (e) => onChange({ [id]: e.target.value }),
        className: "bg-background border-input",
        "data-ocid": `address-${id}`,
        required: true
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleNext, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Delivery Address" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
      field("fullName", "Full Name", "Your full name"),
      field("mobile", "Mobile Number", "10-digit mobile", "tel", "tel")
    ] }),
    field("street", "Street / Locality", "House no., street, area"),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      field("city", "City", "City"),
      field("state", "State", "State")
    ] }),
    field("pincode", "Pincode", "6-digit pincode", "text", "numeric"),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 mt-2",
        "data-ocid": "address-next",
        children: "Continue to Payment →"
      }
    )
  ] });
}
const UPI_ID = "6305462887-3@ybl";
function PaymentStep({
  price,
  productName,
  onNext,
  onBack
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const upiLink = `upi://pay?pa=${UPI_ID}&am=${price}&cu=INR&tn=GUCCORA+${encodeURIComponent(productName)}`;
  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      ue.success("UPI ID copied!");
      setTimeout(() => setCopied(false), 2e3);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-base", children: "₹" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Complete UPI Payment" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/25 rounded-xl p-5 text-center space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Amount to Pay" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-display font-bold text-primary", children: [
        "₹",
        price.toLocaleString("en-IN")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        productName,
        " — GUCCORA"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: "Pay to UPI ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 bg-muted/60 rounded-lg px-3 py-2 text-sm font-mono text-foreground border border-input truncate", children: UPI_ID }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            className: "flex-shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
            onClick: copyUpiId,
            "data-ocid": "copy-upi-id",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
              copied ? "Copied!" : "Copy"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 h-10",
          onClick: () => window.open(upiLink, "_blank"),
          "data-ocid": "open-upi-app",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }),
            "Open in UPI App"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center leading-relaxed", children: [
      "After paying, tap",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: '"Payment Done"' }),
      " ",
      "below and upload your payment screenshot on the next step."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "flex-1",
          onClick: onBack,
          "data-ocid": "payment-back",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
          onClick: onNext,
          "data-ocid": "payment-done",
          children: "Payment Done →"
        }
      )
    ] })
  ] });
}
function UploadStep({
  onSubmit,
  onBack,
  isPending
}) {
  const fileRef = reactExports.useRef(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [fileName, setFileName] = reactExports.useState("");
  function handleFile(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      ue.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      ue.error("Image must be under 5 MB");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const result = (_a2 = ev.target) == null ? void 0 : _a2.result;
      if (typeof result === "string") setPreview(result);
    };
    reader.readAsDataURL(file);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!preview) {
      ue.error("Please upload your payment screenshot");
      return;
    }
    onSubmit(preview);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Upload Payment Screenshot" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Upload a screenshot showing your UPI transaction. This is required for admin verification." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileRef,
        id: "utr-file",
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleFile,
        "data-ocid": "utr-file-input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: "utr-file",
        className: "block border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-smooth",
        "data-ocid": "utr-upload-zone",
        children: preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: preview,
              alt: "Payment screenshot",
              className: "max-h-40 mx-auto rounded-lg object-contain"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-full", children: fileName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: "Tap to change" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Tap to upload screenshot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPG, PNG — max 5 MB" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "flex-1",
          onClick: onBack,
          disabled: isPending,
          "data-ocid": "upload-back",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2",
          disabled: isPending || !preview,
          "data-ocid": "upload-submit",
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Submitting…"
          ] }) : "Submit Order"
        }
      )
    ] })
  ] });
}
function PurchaseDialog({ product, open, onClose }) {
  const { mutateAsync: purchase, isPending } = usePurchasePlan();
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [address, setAddress] = reactExports.useState(EMPTY_ADDRESS);
  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAddress(EMPTY_ADDRESS);
    }, 300);
  }
  async function handleFinalSubmit(screenshotDataUrl) {
    if (!product) return;
    try {
      await purchase({
        productId: product.id,
        deliveryAddress: buildAddressJson(address),
        utrScreenshotUrl: screenshotDataUrl
      });
      ue.success(
        "Order submitted for admin approval. You will be notified once approved.",
        { duration: 5e3 }
      );
      handleClose();
      navigate({ to: "/dashboard" });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    }
  }
  const price = product ? Number(product.price) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border border-border max-w-md w-full max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 text-primary" }),
      product == null ? void 0 : product.name,
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-primary/10 text-primary border-primary/20 text-xs font-semibold", children: [
        "₹",
        price.toLocaleString("en-IN")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step, total: 3 }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddressStep,
      {
        address,
        onChange: (f) => setAddress((prev) => ({ ...prev, ...f })),
        onNext: () => setStep(2)
      }
    ),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentStep,
      {
        price,
        productName: (product == null ? void 0 : product.name) ?? "",
        onNext: () => setStep(3),
        onBack: () => setStep(1)
      }
    ),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UploadStep,
      {
        onSubmit: handleFinalSubmit,
        onBack: () => setStep(2),
        isPending
      }
    )
  ] }) });
}
function ProductCard({
  product,
  onBuy
}) {
  const meta = getProductMeta(product.name);
  const Icon = meta.icon;
  const price = Number(product.price);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: `relative bg-card border transition-smooth hover:shadow-elevated group ${meta.highlight ? "border-primary/50 shadow-subtle" : "border-border hover:border-primary/30"}`,
      "data-ocid": `product-card-${product.id}`,
      children: [
        meta.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-0 right-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground text-xs px-3 py-0.5 shadow-subtle", children: "✦ Most Popular" }) }),
        product.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `overflow-hidden rounded-t-lg ${meta.highlight ? "mt-3" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.imageUrl,
                alt: product.name,
                className: "w-full h-36 object-cover group-hover:scale-105 transition-smooth"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardHeader,
          {
            className: `pb-3 ${meta.highlight && !product.imageUrl ? "pt-7" : "pt-5"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                !product.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${meta.highlight ? "bg-primary/15 border border-primary/30" : "bg-muted/60 border border-border"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        className: `h-5 w-5 ${meta.highlight ? "text-primary" : "text-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground leading-tight", children: product.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta.badge })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-display font-bold text-primary leading-tight", children: [
                  "₹",
                  price.toLocaleString("en-IN")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "one time" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: meta.features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-2 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
                feature
              ]
            },
            feature
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: `w-full font-semibold gap-2 h-10 rounded-lg transition-smooth ${meta.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"}`,
              onClick: () => onBuy(product),
              "data-ocid": `product-buy-${product.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
                "Buy Now"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductsPage() {
  const { data: products, isLoading } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const activeProducts = (products == null ? void 0 : products.filter((p) => p.isActive)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-[calc(100vh-7rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "border-primary/40 text-primary text-xs tracking-wider uppercase",
          children: "Product Plans"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl font-display font-bold text-foreground mt-2", children: [
        "Choose Your ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "GUCCORA Plan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed", children: "Each plan is a real product purchase. Earn structured commissions when your referrals buy." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/20 border-b border-border py-5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium", children: "Commission Structure" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        {
          label: "Direct Income",
          value: "₹40",
          desc: "Per referral purchase"
        },
        {
          label: "Level Income",
          value: "₹5 × 10",
          desc: "Up to 10 levels deep"
        },
        {
          label: "Pair Income",
          value: "₹3",
          desc: "Team matching bonus"
        },
        {
          label: "Max Per Order",
          value: "₹93",
          desc: "Total cap per sale"
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-primary", children: item.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mt-0.5", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: item.desc })
          ]
        },
        item.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-4xl mx-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" }, i)) }) : activeProducts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6", children: activeProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductCard,
      {
        product,
        onBuy: setSelectedProduct
      },
      String(product.id)
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl",
        "data-ocid": "products-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No products available yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Check back soon." })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/20 border-t border-border py-6 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "100% product-based" }),
      " ",
      "— Income is only generated when a real product is purchased. Total payout capped at ₹93 per order."
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PurchaseDialog,
      {
        product: selectedProduct,
        open: !!selectedProduct,
        onClose: () => setSelectedProduct(null)
      }
    )
  ] });
}
export {
  ProductsPage as default
};
