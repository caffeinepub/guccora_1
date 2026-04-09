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
import {
  CheckCircle,
  ImageIcon,
  MapPin,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminApproveOrder,
  useAdminOrders,
  useAdminPendingOrders,
  useAdminRejectOrder,
} from "../../hooks/useBackend";
import { OrderStatus } from "../../types";
import type { Order } from "../../types";

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  if (status === OrderStatus.approved)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
        Approved
      </Badge>
    );
  if (status === OrderStatus.rejected)
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

function OrderCard({
  order,
  onApprove,
  onReject,
  approving,
  rejecting,
}: {
  order: Order;
  onApprove?: (id: bigint) => void;
  onReject?: (order: Order) => void;
  approving: boolean;
  rejecting: boolean;
}) {
  const [showImage, setShowImage] = useState(false);
  const isPending = order.status === OrderStatus.pendingApproval;

  return (
    <div
      className="bg-background border border-border rounded-xl p-4 space-y-3"
      data-ocid={`admin-order-${order.id}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            Order #{String(order.id)}
          </p>
          <p className="text-sm font-bold text-primary mt-0.5">
            {formatRupees(order.planPrice)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Buyer */}
      <div className="text-xs text-muted-foreground font-mono truncate">
        Buyer: {order.buyer.slice(0, 28)}…
      </div>

      {/* Delivery address */}
      {order.deliveryAddress && (
        <div className="flex items-start gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground break-words">
            {order.deliveryAddress}
          </p>
        </div>
      )}

      {/* UTR Screenshot */}
      {order.utrScreenshotUrl && (
        <div>
          <button
            type="button"
            onClick={() => setShowImage(true)}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            data-ocid={`admin-view-utr-${order.id}`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            View UTR Screenshot
          </button>
        </div>
      )}

      {/* Rejection reason */}
      {order.rejectionReason && (
        <p className="text-xs text-destructive bg-destructive/5 border border-destructive/10 rounded px-2 py-1.5">
          Reason: {order.rejectionReason}
        </p>
      )}

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground">
        {new Date(Number(order.timestamp) / 1_000_000).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Actions for pending orders */}
      {isPending && onApprove && onReject && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-8"
            onClick={() => onApprove(order.id)}
            disabled={approving || rejecting}
            data-ocid={`admin-approve-order-${order.id}`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Approve & Distribute
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 h-8"
            onClick={() => onReject(order)}
            disabled={approving || rejecting}
            data-ocid={`admin-reject-order-${order.id}`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}

      {/* Image modal */}
      <Dialog open={showImage} onOpenChange={setShowImage}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              UTR Payment Screenshot
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-lg overflow-hidden border border-border max-h-[60vh]">
            <img
              src={order.utrScreenshotUrl}
              alt="UTR Screenshot"
              className="w-full object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Order #{String(order.id)} · {formatRupees(order.planPrice)}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminOrdersTab() {
  const { data: pendingOrders, isLoading: pendingLoading } =
    useAdminPendingOrders();
  const { data: allOrders, isLoading: allLoading } = useAdminOrders();
  const { mutateAsync: approveOrder, isPending: approving } =
    useAdminApproveOrder();
  const { mutateAsync: rejectOrder, isPending: rejecting } =
    useAdminRejectOrder();

  const [rejectDialog, setRejectDialog] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (orderId: bigint) => {
    try {
      await approveOrder(orderId);
      toast.success("Order approved — commissions distributed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve order",
      );
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      await rejectOrder({ orderId: rejectDialog.id, reason: rejectReason });
      toast.success("Order rejected");
      setRejectDialog(null);
      setRejectReason("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reject order",
      );
    }
  };

  const approvedOrders = (allOrders ?? []).filter(
    (o) => o.status === OrderStatus.approved,
  );
  const rejectedOrders = (allOrders ?? []).filter(
    (o) => o.status === OrderStatus.rejected,
  );
  const pendingList = pendingOrders ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-display font-semibold text-foreground">
          Order Management
        </h2>
        <p className="text-xs text-muted-foreground">
          Approve payments to distribute commissions
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-muted/40 border border-border h-9 p-1 rounded-xl w-full sm:w-auto gap-1">
          <TabsTrigger
            value="pending"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-orders-tab-pending"
          >
            Pending
            {pendingList.length > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1 ml-1">
                {pendingList.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-orders-tab-approved"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="rounded-lg text-xs flex-1 sm:flex-none py-1.5"
            data-ocid="admin-orders-tab-rejected"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        {/* Pending */}
        <TabsContent value="pending" className="mt-4">
          {pendingLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : pendingList.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {pendingList.map((order) => (
                <OrderCard
                  key={String(order.id)}
                  order={order}
                  onApprove={handleApprove}
                  onReject={(o) => {
                    setRejectDialog(o);
                    setRejectReason("");
                  }}
                  approving={approving}
                  rejecting={rejecting}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-16 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  No pending orders
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All caught up!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Approved */}
        <TabsContent value="approved" className="mt-4">
          {allLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : approvedOrders.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {approvedOrders.map((order) => (
                <OrderCard
                  key={String(order.id)}
                  order={order}
                  approving={false}
                  rejecting={false}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No approved orders yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="mt-4">
          {allLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : rejectedOrders.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {rejectedOrders.map((order) => (
                <OrderCard
                  key={String(order.id)}
                  order={order}
                  approving={false}
                  rejecting={false}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No rejected orders
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
              Reject Order #{String(rejectDialog?.id)}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground pb-1">
            This will reject the order for{" "}
            <strong className="text-foreground">
              {rejectDialog && formatRupees(rejectDialog.planPrice)}
            </strong>
            . Please provide a reason.
          </p>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection (e.g. Invalid UTR, payment not received)…"
            className="bg-background border-input resize-none"
            rows={3}
            data-ocid="admin-reject-reason"
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
              data-ocid="admin-confirm-reject-order"
            >
              {rejecting ? "Rejecting…" : "Reject Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
