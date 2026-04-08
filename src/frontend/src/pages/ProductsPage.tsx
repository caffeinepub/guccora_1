import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Copy,
  Crown,
  Diamond,
  ExternalLink,
  Loader2,
  MapPin,
  ShoppingCart,
  Star,
  Upload,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGetProducts, usePurchasePlan } from "../hooks/useBackend";
import type { Product } from "../types";

// ─── Product metadata ─────────────────────────────────────────────────────────

const PRODUCT_META: Record<
  string,
  {
    icon: React.ElementType;
    badge: string;
    features: string[];
    highlight: boolean;
  }
> = {
  Silver: {
    icon: Zap,
    badge: "Starter Kit",
    features: [
      "Real product access",
      "Direct ₹40 per referral",
      "Level income eligible",
    ],
    highlight: false,
  },
  Gold: {
    icon: Star,
    badge: "Growth Pack",
    features: [
      "Real product access",
      "Direct ₹40 per referral",
      "Level income eligible",
    ],
    highlight: false,
  },
  Platinum: {
    icon: Crown,
    badge: "Premium Pack",
    features: [
      "Premium product access",
      "Direct ₹40 per referral",
      "Pair income eligible",
    ],
    highlight: true,
  },
  Diamond: {
    icon: Diamond,
    badge: "Elite Bundle",
    features: [
      "Elite product access",
      "Direct ₹40 per referral",
      "Max pair income ₹3",
    ],
    highlight: true,
  },
};

function getProductMeta(name: string) {
  return (
    PRODUCT_META[name] ?? {
      icon: Star,
      badge: "Member Pack",
      features: ["Product access", "Commission eligible"],
      highlight: false,
    }
  );
}

// ─── Delivery Address form state ──────────────────────────────────────────────

interface AddressFields {
  fullName: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: AddressFields = {
  fullName: "",
  mobile: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

function buildAddressJson(a: AddressFields): string {
  return JSON.stringify(a);
}

function isAddressComplete(a: AddressFields): boolean {
  return Object.values(a).every((v) => v.trim().length > 0);
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Address", "Payment", "Upload"];
  return (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-smooth ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : step}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active
                    ? "text-primary"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {step < total && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-18px] ${done ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Delivery Address ────────────────────────────────────────────────

function AddressStep({
  address,
  onChange,
  onNext,
}: {
  address: AddressFields;
  onChange: (f: Partial<AddressFields>) => void;
  onNext: () => void;
}) {
  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!isAddressComplete(address)) {
      toast.error("Please fill in all address fields");
      return;
    }
    if (!/^\d{10}$/.test(address.mobile.trim())) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }
    onNext();
  }

  const field = (
    id: keyof AddressFields,
    label: string,
    placeholder: string,
    type = "text",
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"],
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} <span className="text-primary">*</span>
      </Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={address[id]}
        onChange={(e) => onChange({ [id]: e.target.value })}
        className="bg-background border-input"
        data-ocid={`address-${id}`}
        required
      />
    </div>
  );

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-foreground text-sm">
          Delivery Address
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("fullName", "Full Name", "Your full name")}
        {field("mobile", "Mobile Number", "10-digit mobile", "tel", "tel")}
      </div>
      {field("street", "Street / Locality", "House no., street, area")}
      <div className="grid grid-cols-2 gap-3">
        {field("city", "City", "City")}
        {field("state", "State", "State")}
      </div>
      {field("pincode", "Pincode", "6-digit pincode", "text", "numeric")}

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 mt-2"
        data-ocid="address-next"
      >
        Continue to Payment →
      </Button>
    </form>
  );
}

// ─── Step 2 — UPI Payment ─────────────────────────────────────────────────────

const UPI_ID = "6305462887-3@ybl";

function PaymentStep({
  price,
  productName,
  onNext,
  onBack,
}: {
  price: number;
  productName: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const upiLink = `upi://pay?pa=${UPI_ID}&am=${price}&cu=INR&tn=GUCCORA+${encodeURIComponent(productName)}`;

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      toast.success("UPI ID copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-primary text-base">₹</span>
        <h3 className="font-display font-semibold text-foreground text-sm">
          Complete UPI Payment
        </h3>
      </div>

      {/* Amount highlight */}
      <div className="bg-primary/10 border border-primary/25 rounded-xl p-5 text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Amount to Pay
        </p>
        <p className="text-4xl font-display font-bold text-primary">
          ₹{price.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-muted-foreground">{productName} — GUCCORA</p>
      </div>

      {/* UPI ID box */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Pay to UPI ID
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted/60 rounded-lg px-3 py-2 text-sm font-mono text-foreground border border-input truncate">
            {UPI_ID}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            onClick={copyUpiId}
            data-ocid="copy-upi-id"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 h-10"
          onClick={() => window.open(upiLink, "_blank")}
          data-ocid="open-upi-app"
        >
          <ExternalLink className="h-4 w-4" />
          Open in UPI App
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        After paying, tap{" "}
        <span className="text-foreground font-medium">"Payment Done"</span>{" "}
        below and upload your payment screenshot on the next step.
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          data-ocid="payment-back"
        >
          ← Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          onClick={onNext}
          data-ocid="payment-done"
        >
          Payment Done →
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 — UTR Screenshot Upload ──────────────────────────────────────────

function UploadStep({
  onSubmit,
  onBack,
  isPending,
}: {
  onSubmit: (dataUrl: string) => void;
  onBack: () => void;
  isPending: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setPreview(result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) {
      toast.error("Please upload your payment screenshot");
      return;
    }
    onSubmit(preview);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Upload className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-foreground text-sm">
          Upload Payment Screenshot
        </h3>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Upload a screenshot showing your UPI transaction. This is required for
        admin verification.
      </p>

      {/* Drop zone */}
      {/* Hidden file input */}
      <input
        ref={fileRef}
        id="utr-file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        data-ocid="utr-file-input"
      />

      {/* Clickable label acting as drop zone */}
      <label
        htmlFor="utr-file"
        className="block border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-smooth"
        data-ocid="utr-upload-zone"
      >
        {preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Payment screenshot"
              className="max-h-40 mx-auto rounded-lg object-contain"
            />
            <p className="text-xs text-muted-foreground truncate max-w-full">
              {fileName}
            </p>
            <p className="text-xs text-primary font-medium">Tap to change</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Tap to upload screenshot
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG — max 5 MB
              </p>
            </div>
          </div>
        )}
      </label>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
          data-ocid="upload-back"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
          disabled={isPending || !preview}
          data-ocid="upload-submit"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Order"
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Purchase Dialog (multi-step) ─────────────────────────────────────────────

interface PurchaseDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

function PurchaseDialog({ product, open, onClose }: PurchaseDialogProps) {
  const { mutateAsync: purchase, isPending } = usePurchasePlan();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<AddressFields>(EMPTY_ADDRESS);

  function handleClose() {
    onClose();
    // Reset after close animation
    setTimeout(() => {
      setStep(1);
      setAddress(EMPTY_ADDRESS);
    }, 300);
  }

  async function handleFinalSubmit(screenshotDataUrl: string) {
    if (!product) return;
    try {
      await purchase({
        productId: product.id,
        deliveryAddress: buildAddressJson(address),
        utrScreenshotUrl: screenshotDataUrl,
      });
      toast.success(
        "Order submitted for admin approval. You will be notified once approved.",
        { duration: 5000 },
      );
      handleClose();
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    }
  }

  const price = product ? Number(product.price) : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-card border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {product?.name}
            <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
              ₹{price.toLocaleString("en-IN")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <StepIndicator current={step} total={3} />

        {step === 1 && (
          <AddressStep
            address={address}
            onChange={(f) => setAddress((prev) => ({ ...prev, ...f }))}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <PaymentStep
            price={price}
            productName={product?.name ?? ""}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <UploadStep
            onSubmit={handleFinalSubmit}
            onBack={() => setStep(2)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onBuy,
}: { product: Product; onBuy: (p: Product) => void }) {
  const meta = getProductMeta(product.name);
  const Icon = meta.icon;
  const price = Number(product.price);

  return (
    <Card
      className={`relative bg-card border transition-smooth hover:shadow-elevated group ${
        meta.highlight
          ? "border-primary/50 shadow-subtle"
          : "border-border hover:border-primary/30"
      }`}
      data-ocid={`product-card-${product.id}`}
    >
      {meta.highlight && (
        <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
          <Badge className="bg-primary text-primary-foreground text-xs px-3 py-0.5 shadow-subtle">
            ✦ Most Popular
          </Badge>
        </div>
      )}

      {product.imageUrl && (
        <div
          className={`overflow-hidden rounded-t-lg ${meta.highlight ? "mt-3" : ""}`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-36 object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      )}

      <CardHeader
        className={`pb-3 ${meta.highlight && !product.imageUrl ? "pt-7" : "pt-5"}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {!product.imageUrl && (
              <div
                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  meta.highlight
                    ? "bg-primary/15 border border-primary/30"
                    : "bg-muted/60 border border-border"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${meta.highlight ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display font-bold text-foreground leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{meta.badge}</p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-display font-bold text-primary leading-tight">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">one time</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {meta.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className={`w-full font-semibold gap-2 h-10 rounded-lg transition-smooth ${
            meta.highlight
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
          onClick={() => onBuy(product)}
          data-ocid={`product-buy-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { data: products, isLoading } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeProducts = products?.filter((p) => p.isActive) ?? [];

  return (
    <div className="bg-background min-h-[calc(100vh-7rem)]">
      {/* Hero */}
      <section className="bg-card border-b border-border py-10 px-4">
        <div className="container max-w-4xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs tracking-wider uppercase"
          >
            Product Plans
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Choose Your <span className="text-primary">GUCCORA Plan</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Each plan is a real product purchase. Earn structured commissions
            when your referrals buy.
          </p>
        </div>
      </section>

      {/* Commission Info Bar */}
      <section className="bg-muted/20 border-b border-border py-5 px-4">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">
            Commission Structure
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Direct Income",
                value: "₹40",
                desc: "Per referral purchase",
              },
              {
                label: "Level Income",
                value: "₹5 × 10",
                desc: "Up to 10 levels deep",
              },
              {
                label: "Pair Income",
                value: "₹3",
                desc: "Team matching bonus",
              },
              {
                label: "Max Per Order",
                value: "₹93",
                desc: "Total cap per sale",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card border border-border rounded-xl p-3 text-center"
              >
                <p className="text-xl font-display font-bold text-primary">
                  {item.value}
                </p>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 px-4">
        <div className="container max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : activeProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {activeProducts.map((product) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  onBuy={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl"
              data-ocid="products-empty"
            >
              <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No products available yet.</p>
              <p className="text-sm mt-1">Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-muted/20 border-t border-border py-6 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            <span className="text-primary font-medium">100% product-based</span>{" "}
            — Income is only generated when a real product is purchased. Total
            payout capped at ₹93 per order.
          </p>
        </div>
      </section>

      {/* Multi-step Purchase Dialog */}
      <PurchaseDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
