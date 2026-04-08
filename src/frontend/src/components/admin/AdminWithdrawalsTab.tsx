import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Wallet, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "../../hooks/useBackend";
import { WithdrawStatus } from "../../types";
import type { WithdrawRequest } from "../../types";

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: WithdrawRequest["status"] }) {
  if (status === WithdrawStatus.approved)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
        Approved
      </Badge>
    );
  if (status === WithdrawStatus.rejected)
    return (
      <Badge variant="destructive" className="text-xs opacity-80">
        Rejected
      </Badge>
    );
  return (
    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
      Pending
    </Badge>
  );
}

export default function AdminWithdrawalsTab() {
  const { data: withdrawals, isLoading } = useAdminWithdrawals();
  const { mutateAsync: approve, isPending: approving } = useApproveWithdrawal();
  const { mutateAsync: reject, isPending: rejecting } = useRejectWithdrawal();

  const [rejectDialog, setRejectDialog] = useState<WithdrawRequest | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  const pending = (withdrawals ?? []).filter(
    (w) => w.status === WithdrawStatus.pending,
  );
  const approved = (withdrawals ?? []).filter(
    (w) => w.status === WithdrawStatus.approved,
  );
  const rejected = (withdrawals ?? []).filter(
    (w) => w.status === WithdrawStatus.rejected,
  );

  const handleApprove = async (id: bigint) => {
    try {
      await approve(id);
      toast.success("Withdrawal approved successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve withdrawal",
      );
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    try {
      await reject(rejectDialog.id);
      toast.success("Withdrawal rejected");
      setRejectDialog(null);
      setRejectReason("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reject withdrawal",
      );
    }
  };

  function WithdrawCard({
    req,
    showActions,
  }: {
    req: WithdrawRequest;
    showActions: boolean;
  }) {
    return (
      <div
        className="bg-background border border-border rounded-xl p-4 space-y-3"
        data-ocid={`admin-withdrawal-${req.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              #{String(req.id)}
            </p>
            <p className="text-xl font-bold text-primary mt-0.5">
              {formatRupees(req.amount)}
            </p>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <p className="text-xs text-muted-foreground font-mono truncate">
          User: {req.user.toText().slice(0, 28)}…
        </p>

        <p className="text-xs text-muted-foreground">
          Requested:{" "}
          {new Date(Number(req.requestedAt) / 1_000_000).toLocaleString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        </p>
        {req.processedAt && (
          <p className="text-xs text-muted-foreground">
            Processed:{" "}
            {new Date(Number(req.processedAt) / 1_000_000).toLocaleDateString(
              "en-IN",
            )}
          </p>
        )}

        {showActions && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-8"
              onClick={() => handleApprove(req.id)}
              disabled={approving || rejecting}
              data-ocid={`admin-approve-withdrawal-${req.id}`}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 h-8"
              onClick={() => {
                setRejectDialog(req);
                setRejectReason("");
              }}
              disabled={approving || rejecting}
              data-ocid={`admin-reject-withdrawal-${req.id}`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-display font-semibold text-foreground">
          Withdrawal Management
        </h2>
        <p className="text-xs text-muted-foreground">
          Approve or reject user withdrawal requests
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-muted/40 border border-border h-9 p-1 rounded-xl w-full sm:w-auto gap-1">
          <TabsTrigger
            value="pending"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-withdraw-tab-pending"
          >
            Pending
            {pending.length > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1 ml-1">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-withdraw-tab-approved"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-withdraw-tab-rejected"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : pending.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {pending.map((req) => (
                <WithdrawCard
                  key={String(req.id)}
                  req={req}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-16 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  No pending withdrawals
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All requests processed!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : approved.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {approved.map((req) => (
                <WithdrawCard
                  key={String(req.id)}
                  req={req}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No approved withdrawals yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : rejected.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {rejected.map((req) => (
                <WithdrawCard
                  key={String(req.id)}
                  req={req}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No rejected withdrawals
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectDialog}
        onOpenChange={(o) => {
          if (!o) {
            setRejectDialog(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Reject Withdrawal #{String(rejectDialog?.id)}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground pb-1">
            Rejecting request of{" "}
            <strong className="text-foreground">
              {rejectDialog && formatRupees(rejectDialog.amount)}
            </strong>
            . Please provide a reason (optional).
          </p>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection…"
            className="bg-background border-input resize-none"
            rows={3}
            data-ocid="admin-withdrawal-reject-reason"
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectDialog(null);
                setRejectReason("");
              }}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={rejecting}
              data-ocid="admin-confirm-reject-withdrawal"
            >
              {rejecting ? "Rejecting…" : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
