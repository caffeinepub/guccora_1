import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Pencil,
  Save,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useGetMyPaymentDetails,
  useMyWallet,
  useMyWithdrawals,
  useRequestWithdrawal,
  useSavePaymentDetails,
} from "../hooks/useBackend";
import type { BankDetails } from "../types";
import { WithdrawStatus } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function maskAccount(account: string) {
  if (account.length <= 4) return account;
  return `••••${account.slice(-4)}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: WithdrawStatus }) {
  if (status === WithdrawStatus.approved) {
    return (
      <Badge className="bg-primary/10 text-primary border-primary/30 gap-1 text-xs font-semibold">
        <CheckCircle className="h-3 w-3" />
        Approved
      </Badge>
    );
  }
  if (status === WithdrawStatus.rejected) {
    return (
      <Badge
        variant="destructive"
        className="gap-1 text-xs font-semibold opacity-90"
      >
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-primary/30 text-primary gap-1 text-xs font-semibold"
    >
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}

// ─── Payment Details Section ──────────────────────────────────────────────────

type PaymentTab = "bank" | "upi";

function PaymentDetailsSection() {
  const { data: paymentDetails, isLoading } = useGetMyPaymentDetails();
  const { mutateAsync: savePaymentDetails, isPending: isSaving } =
    useSavePaymentDetails();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<PaymentTab>("bank");

  // Bank fields
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when data loads
  useEffect(() => {
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

  const hasPaymentMethod = !!(
    paymentDetails?.bankDetails || paymentDetails?.upiId
  );

  function validate() {
    const e: Record<string, string> = {};
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
        const bank: BankDetails = {
          accountNumber: accountNumber.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          accountHolderName: accountHolderName.trim(),
        };
        await savePaymentDetails({ bankDetails: bank, upiId: null });
      } else {
        await savePaymentDetails({ bankDetails: null, upiId: upiId.trim() });
      }
      toast.success("Payment details saved successfully!");
      setEditMode(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save. Try again.",
      );
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const showForm = editMode || !hasPaymentMethod;

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Payment Method
          </CardTitle>
          {hasPaymentMethod && !editMode && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-smooth font-medium"
              aria-label="Edit payment method"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Saved method display */}
        {hasPaymentMethod && !editMode && (
          <div className="space-y-2 mb-2">
            {paymentDetails?.bankDetails && (
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Banknote className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {paymentDetails.bankDetails.accountHolderName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A/C: {maskAccount(paymentDetails.bankDetails.accountNumber)}{" "}
                    · {paymentDetails.bankDetails.ifsc}
                  </p>
                </div>
                <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs shrink-0">
                  Bank
                </Badge>
              </div>
            )}
            {paymentDetails?.upiId && (
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    UPI ID
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {paymentDetails.upiId}
                  </p>
                </div>
                <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs shrink-0">
                  UPI
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="space-y-4">
            {/* Tabs */}
            <div
              className="flex rounded-xl overflow-hidden border border-border bg-muted/30 p-1 gap-1"
              role="tablist"
            >
              {(
                [
                  {
                    id: "bank" as PaymentTab,
                    icon: Banknote,
                    label: "Bank Account",
                  },
                  {
                    id: "upi" as PaymentTab,
                    icon: CreditCard,
                    label: "UPI ID",
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrors({});
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-smooth ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`payment-tab-${tab.id}`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Bank Fields */}
            {activeTab === "bank" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="accountHolderName"
                    className="text-sm font-medium"
                  >
                    Account Holder Name{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="accountHolderName"
                    placeholder="Full name as on bank account"
                    value={accountHolderName}
                    onChange={(e) => {
                      setAccountHolderName(e.target.value);
                      if (errors.accountHolderName)
                        setErrors((p) => ({ ...p, accountHolderName: "" }));
                    }}
                    className="bg-background border-input h-11 rounded-lg"
                    data-ocid="bank-account-holder"
                  />
                  {errors.accountHolderName && (
                    <p className="text-xs text-destructive">
                      {errors.accountHolderName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-medium"
                  >
                    Account Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter bank account number"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value.replace(/\D/g, ""));
                      if (errors.accountNumber)
                        setErrors((p) => ({ ...p, accountNumber: "" }));
                    }}
                    className="bg-background border-input h-11 rounded-lg font-mono"
                    data-ocid="bank-account-number"
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-destructive">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ifsc" className="text-sm font-medium">
                    IFSC Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ifsc"
                    placeholder="e.g. SBIN0001234"
                    value={ifsc}
                    onChange={(e) => {
                      setIfsc(e.target.value.toUpperCase());
                      if (errors.ifsc) setErrors((p) => ({ ...p, ifsc: "" }));
                    }}
                    className="bg-background border-input h-11 rounded-lg font-mono tracking-wider"
                    data-ocid="bank-ifsc"
                  />
                  {errors.ifsc && (
                    <p className="text-xs text-destructive">{errors.ifsc}</p>
                  )}
                </div>
              </div>
            )}

            {/* UPI Field */}
            {activeTab === "upi" && (
              <div className="space-y-1.5">
                <Label htmlFor="upiId" className="text-sm font-medium">
                  UPI ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="upiId"
                  placeholder="e.g. yourname@upi or 9876543210@ybl"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    if (errors.upiId) setErrors((p) => ({ ...p, upiId: "" }));
                  }}
                  className="bg-background border-input h-11 rounded-lg"
                  data-ocid="upi-id-input"
                />
                {errors.upiId ? (
                  <p className="text-xs text-destructive">{errors.upiId}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Enter your UPI ID linked to your bank account
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold rounded-xl transition-smooth"
                data-ocid="save-payment-details"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Payment Details
                  </>
                )}
              </Button>
              {editMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setErrors({});
                  }}
                  className="h-11 px-4 rounded-xl border-border"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WithdrawPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: paymentDetails, isLoading: paymentLoading } =
    useGetMyPaymentDetails();
  const { data: withdrawals, isLoading: withdrawalsLoading } =
    useMyWithdrawals();
  const { mutateAsync: requestWithdrawal, isPending } = useRequestWithdrawal();

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const balance = wallet ? Number(wallet.balance) : 0;
  const hasPaymentMethod = !!(
    paymentDetails?.bankDetails || paymentDetails?.upiId
  );

  function validateAmount(val: string) {
    if (!val) return "Amount is required";
    const n = Number.parseFloat(val);
    if (Number.isNaN(n) || n <= 0) return "Amount must be greater than 0";
    if (!Number.isInteger(n)) return "Amount must be a whole number";
    if (n < 100) return "Minimum withdrawal amount is ₹100";
    if (n > balance)
      return `Amount exceeds available balance (${wallet ? formatRupees(wallet.balance) : "₹0"})`;
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
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
      toast.success("Withdrawal request submitted. Awaiting admin approval.");
      setAmount("");
      setAmountError("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Request failed. Please try again.",
      );
    }
  }

  const pendingCount =
    withdrawals?.filter((w) => w.status === WithdrawStatus.pending).length ?? 0;

  return (
    <div className="bg-background min-h-[calc(100vh-7rem)]">
      {/* Page Header */}
      <section className="bg-card border-b border-border px-4 py-6">
        <div className="container max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Withdraw Earnings
            </h1>
            <p className="text-sm text-muted-foreground">
              Transfer commissions to your bank account or UPI
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="container max-w-3xl mx-auto space-y-5">
          {/* Balance Card */}
          <div className="bg-card border border-primary/25 rounded-2xl p-5 relative overflow-hidden shadow-subtle">
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="flex items-center justify-between mb-2 relative">
              <p className="text-sm text-muted-foreground font-medium">
                Available Balance
              </p>
              <Wallet className="h-5 w-5 text-primary opacity-70" />
            </div>
            {walletLoading ? (
              <Skeleton className="h-10 w-40 mt-1" />
            ) : (
              <p className="text-4xl font-display font-bold text-primary mt-1 relative">
                {wallet ? formatRupees(wallet.balance) : "₹0.00"}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              Commission earnings available for withdrawal
            </p>
            {pendingCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-xs text-primary font-medium">
                <Clock className="h-3.5 w-3.5" />
                {pendingCount} pending request{pendingCount > 1 ? "s" : ""}
              </div>
            )}

            {/* Income breakdown */}
            {wallet && (
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40">
                {[
                  { label: "Direct", value: wallet.directIncome },
                  { label: "Level", value: wallet.levelIncome },
                  { label: "Pair", value: wallet.pairIncome },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-display font-bold text-primary mt-0.5">
                      {formatRupees(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Details */}
          <PaymentDetailsSection />

          {/* Withdrawal Form */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
              <CardTitle className="text-base font-display text-foreground flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-primary" />
                Request Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Gate: no payment method */}
              {!paymentLoading && !hasPaymentMethod && (
                <div
                  className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4"
                  data-ocid="no-payment-method-warning"
                >
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground font-medium">
                    Please add your bank account or UPI ID above before
                    requesting a withdrawal.
                  </p>
                </div>
              )}

              {balance <= 0 && !walletLoading ? (
                <div className="text-center py-6 space-y-2">
                  <Wallet className="h-8 w-8 mx-auto text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    Your balance is ₹0.00. Earn commissions by referring others
                    to GUCCORA.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: "/products" })}
                    className="mt-2"
                  >
                    Browse Plans
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="withdraw-form"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-sm font-medium">
                      Amount (₹) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="100"
                      step="1"
                      placeholder="Minimum ₹100"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (amountError) setAmountError("");
                      }}
                      onBlur={() => {
                        if (amount) setAmountError(validateAmount(amount));
                      }}
                      className="bg-background border-input h-11 rounded-lg"
                      disabled={!hasPaymentMethod}
                      data-ocid="withdraw-amount"
                      aria-describedby={
                        amountError ? "amount-error" : "amount-hint"
                      }
                    />
                    {amountError ? (
                      <p id="amount-error" className="text-xs text-destructive">
                        {amountError}
                      </p>
                    ) : (
                      <p
                        id="amount-hint"
                        className="text-xs text-muted-foreground"
                      >
                        {wallet
                          ? `Minimum ₹100 · Max: ${formatRupees(wallet.balance)} · Whole numbers only`
                          : "Enter the amount to withdraw"}
                      </p>
                    )}
                  </div>

                  {/* Quick amount buttons */}
                  {wallet && wallet.balance >= 100n && hasPaymentMethod && (
                    <div className="flex gap-2 flex-wrap">
                      {[25, 50, 100].map((pct) => {
                        const quickAmt = Math.floor((balance * pct) / 100);
                        if (quickAmt < 100) return null;
                        return (
                          <button
                            key={pct}
                            type="button"
                            className="text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth"
                            onClick={() => {
                              setAmount(String(quickAmt));
                              setAmountError("");
                            }}
                          >
                            {pct}% (₹{quickAmt.toLocaleString("en-IN")})
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        className="text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth"
                        onClick={() => {
                          setAmount(String(balance));
                          setAmountError("");
                        }}
                      >
                        Max (₹{balance.toLocaleString("en-IN")})
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold rounded-xl transition-smooth text-base"
                    disabled={
                      isPending ||
                      !amount ||
                      walletLoading ||
                      balance < 100 ||
                      !hasPaymentMethod
                    }
                    data-ocid="withdraw-submit"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting…
                      </>
                    ) : !hasPaymentMethod ? (
                      "Add Payment Method First"
                    ) : (
                      "Request Withdrawal"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Withdrawals are processed manually by admin. Allow 1–3
                    business days.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <div>
            <h2 className="text-base font-display font-bold text-foreground mb-3">
              Withdrawal History
            </h2>
            {withdrawalsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : withdrawals && withdrawals.length > 0 ? (
              <div className="space-y-2">
                {withdrawals.map((req) => (
                  <div
                    key={String(req.id)}
                    className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/20 transition-smooth"
                    data-ocid={`withdrawal-row-${req.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                        <ArrowDownLeft className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {formatRupees(req.amount)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              Number(req.requestedAt) / 1_000_000,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          {req.processedAt && (
                            <p className="text-xs text-muted-foreground">
                              · Processed{" "}
                              {new Date(
                                Number(req.processedAt) / 1_000_000,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-10 border border-dashed border-border rounded-xl"
                data-ocid="withdrawals-empty"
              >
                <ArrowDownLeft className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground font-medium">
                  No withdrawal requests yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your withdrawal history will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
