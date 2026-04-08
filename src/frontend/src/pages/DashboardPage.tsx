import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BellOff,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  GitBranch,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useDirectDownline,
  useDownlineTree,
  useMarkNotificationRead,
  useMyNotifications,
  useMyOrders,
  useMyProfile,
  useMyReferralCode,
  useMyWallet,
} from "../hooks/useBackend";
import { OrderStatus } from "../types";
import type { Notification, Order, TreeNode } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTimestamp(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelative(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatTimestamp(ts);
}

function orderStatusConfig(status: OrderStatus) {
  switch (status) {
    case OrderStatus.approved:
      return {
        label: "Approved",
        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      };
    case OrderStatus.rejected:
      return {
        label: "Rejected",
        className: "bg-destructive/15 text-destructive border-destructive/30",
      };
    default:
      return {
        label: "Pending Approval",
        className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IncomeCard({
  label,
  value,
  icon: Icon,
  description,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  description: string;
  loading: boolean;
}) {
  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        {loading ? (
          <Skeleton className="h-6 w-28 mt-2" />
        ) : (
          <p className="text-xl font-display font-bold text-primary mt-1">
            {value}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

function OrderRow({ order }: { order: Order }) {
  const { label, className } = orderStatusConfig(order.status);
  return (
    <div
      className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/20 transition-smooth"
      data-ocid={`order-row-${order.id}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">
          Product #{String(order.planId)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Order #{String(order.id)} · {formatTimestamp(order.timestamp)}
        </p>
        {order.status === OrderStatus.rejected && order.rejectionReason && (
          <p className="text-xs text-destructive mt-0.5 truncate">
            Reason: {order.rejectionReason}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <span className="text-sm font-bold text-primary">
          {formatRupees(order.planPrice)}
        </span>
        <Badge variant="outline" className={`text-xs ${className}`}>
          {label}
        </Badge>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: bigint) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={`w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 border transition-smooth group ${
        notification.isRead
          ? "bg-card border-border opacity-70"
          : "bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/8 cursor-pointer"
      }`}
      data-ocid={`notification-item-${notification.id}`}
      aria-label={
        notification.isRead
          ? notification.message
          : `Mark as read: ${notification.message}`
      }
    >
      <div className="flex-shrink-0 mt-0.5">
        {notification.isRead ? (
          <CheckCheck className="h-4 w-4 text-muted-foreground" />
        ) : (
          <div className="h-4 w-4 rounded-full bg-primary/80 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${notification.isRead ? "text-muted-foreground" : "text-foreground font-medium"}`}
        >
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelative(notification.timestamp)}
        </p>
      </div>
      {!notification.isRead && (
        <Badge className="flex-shrink-0 bg-primary/20 text-primary border-primary/30 text-[10px] self-start">
          New
        </Badge>
      )}
    </button>
  );
}

function TreeNodeBox({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`px-3 py-1.5 rounded-lg border text-xs font-medium min-w-[80px] text-center truncate max-w-[100px] ${
          depth === 0
            ? "bg-primary/15 border-primary/40 text-primary"
            : "bg-muted/50 border-border text-foreground"
        }`}
        title={node.name}
      >
        {node.name}
      </div>
      {node.children.length > 0 && (
        <div className="flex gap-4 mt-1 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-border" />
          {node.children.map((child) => (
            <div
              key={child.user.toText()}
              className="flex flex-col items-center gap-1 mt-3"
            >
              <div className="w-px h-3 bg-border mx-auto" />
              <TreeNodeBox node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const [teamExpanded, setTeamExpanded] = useState(false);

  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: referralCode, isLoading: refLoading } = useMyReferralCode();
  const { data: downline, isLoading: downlineLoading } = useDirectDownline();
  const { data: tree } = useDownlineTree();
  const { data: orders } = useMyOrders();
  const { data: notifications, isLoading: notifLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [notifications]);

  const unreadCount = useMemo(
    () => sortedNotifications.filter((n) => !n.isRead).length,
    [sortedNotifications],
  );

  if (!profileLoading && isAuthenticated && !profile) {
    return (
      <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-elevated">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Complete Your Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            You're connected! Now set up your GUCCORA account to start earning
            commissions.
          </p>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold rounded-xl"
            onClick={() => navigate({ to: "/" })}
            data-ocid="dashboard-register-cta"
          >
            Create Your Account
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const referralLink = referralCode
    ? `${window.location.origin}/?ref=${referralCode}`
    : "";

  const copyReferral = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    }
  };

  const handleMarkRead = (id: bigint) => {
    markRead.mutate(id);
  };

  const hasBalance = wallet && wallet.balance > 0n;

  return (
    <div className="bg-background min-h-[calc(100vh-7rem)]">
      {/* Welcome header */}
      <section className="bg-card border-b border-border px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                {profile?.isAdmin && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Admin
                  </Badge>
                )}
              </div>
              {profileLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {profile?.name ?? "—"}
                </h1>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/products" })}
                className="gap-1.5"
                data-ocid="dashboard-buy-plan"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Buy Plan
              </Button>
              {hasBalance && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                  onClick={() => navigate({ to: "/withdraw" })}
                  data-ocid="dashboard-withdraw"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  Withdraw
                </Button>
              )}
              {profile?.isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/admin" })}
                  className="gap-1.5 border-primary/30 text-primary"
                  data-ocid="dashboard-admin-link"
                >
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Commission Wallet + Income Stats */}
      <section className="px-4 py-6">
        <div className="container max-w-4xl mx-auto space-y-5">
          {/* Commission Wallet Balance Card */}
          <div className="bg-card border border-primary/25 rounded-2xl p-5 relative overflow-hidden shadow-subtle">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="flex items-start justify-between mb-2 relative">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Commission Wallet
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                  Earned from referrals & team sales
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </div>
            {walletLoading ? (
              <Skeleton className="h-10 w-44 mt-1" />
            ) : (
              <p className="text-4xl font-display font-bold text-primary mt-1 relative">
                {wallet ? formatRupees(wallet.balance) : "₹0.00"}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              Available for Withdrawal
            </p>
            {hasBalance && (
              <Link
                to="/withdraw"
                className="text-xs text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1"
                data-ocid="wallet-withdraw-link"
              >
                Withdraw funds <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {/* Income breakdown — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <IncomeCard
              label="Direct Income"
              value={wallet ? formatRupees(wallet.directIncome) : "₹0.00"}
              icon={TrendingUp}
              description="₹40 per referral"
              loading={walletLoading}
            />
            <IncomeCard
              label="Level Income"
              value={wallet ? formatRupees(wallet.levelIncome) : "₹0.00"}
              icon={BarChart3}
              description="₹5 × 10 levels"
              loading={walletLoading}
            />
            <IncomeCard
              label="Pair Income"
              value={wallet ? formatRupees(wallet.pairIncome) : "₹0.00"}
              icon={Users}
              description="₹3 per pair"
              loading={walletLoading}
            />
          </div>

          {/* Total income highlight */}
          {wallet && wallet.totalIncome > 0n && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Total Income Earned
              </span>
              <span className="font-display font-bold text-primary text-lg">
                {formatRupees(wallet.totalIncome)}
              </span>
            </div>
          )}

          {/* Referral Link */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Your Referral Link</span>
                {referralCode && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary font-mono text-xs"
                  >
                    {referralCode}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {refLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <div className="flex gap-2" data-ocid="referral-link-section">
                  <input
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono truncate focus:outline-none"
                    data-ocid="referral-link-input"
                    aria-label="Referral link"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReferral}
                    className="gap-1.5 flex-shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                    data-ocid="referral-copy-btn"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Share this link to earn ₹40 direct commission when someone
                purchases a plan.
              </p>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card border border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Direct Referrals
                </p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {downline?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">team members</p>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">My Orders</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {orders?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  product purchases
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Orders */}
      <section className="bg-muted/20 border-t border-border px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-base font-display font-bold text-foreground">
                My Orders
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              Buy More <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {orders && orders.length > 0 ? (
            <div className="space-y-2" data-ocid="orders-list">
              {orders
                .slice()
                .sort((a, b) => Number(b.timestamp - a.timestamp))
                .slice(0, 6)
                .map((order) => (
                  <OrderRow key={String(order.id)} order={order} />
                ))}
            </div>
          ) : (
            <div
              className="text-center py-10 border border-dashed border-border rounded-xl"
              data-ocid="orders-empty"
            >
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground font-medium">
                No orders yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Purchase a plan to start earning commissions
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/products" })}
                data-ocid="orders-empty-cta"
              >
                Browse Plans
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-background border-t border-border px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          <div
            className="flex items-center justify-between mb-4"
            data-ocid="notifications-header"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h2 className="text-base font-display font-bold text-foreground">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <Badge
                  className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full"
                  data-ocid="notifications-unread-badge"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Click to mark as read
              </p>
            )}
          </div>

          {notifLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : sortedNotifications.length > 0 ? (
            <div className="space-y-2" data-ocid="notifications-list">
              {sortedNotifications.map((n) => (
                <NotificationItem
                  key={String(n.id)}
                  notification={n}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-10 border border-dashed border-border rounded-xl"
              data-ocid="notifications-empty"
            >
              <BellOff className="h-7 w-7 mx-auto mb-2 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground font-medium">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Admin announcements and updates will appear here
              </p>
            </div>
          )}
        </div>
      </section>

      {/* My Team */}
      <section className="bg-muted/20 border-t border-border px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          <button
            type="button"
            className="w-full flex items-center justify-between mb-4 group"
            onClick={() => setTeamExpanded((v) => !v)}
            aria-expanded={teamExpanded}
            data-ocid="team-section-toggle"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-base font-display font-bold text-foreground">
                My Team
              </h2>
              {downline && downline.length > 0 && (
                <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">
                  {downline.length}
                </Badge>
              )}
            </div>
            {teamExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>

          {teamExpanded && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              {/* Direct downline list */}
              {downlineLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                  ))}
                </div>
              ) : downline && downline.length > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
                    Direct Referrals
                  </p>
                  <div className="space-y-2">
                    {downline.map((member) => (
                      <div
                        key={member.id.toText()}
                        className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3"
                        data-ocid="team-member-row"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {member.referralCode}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-primary">
                            {formatRupees(member.totalIncome)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            earned
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="text-center py-8 border border-dashed border-border rounded-xl"
                  data-ocid="team-empty"
                >
                  <Users className="h-7 w-7 mx-auto mb-2 text-muted-foreground opacity-40" />
                  <p className="text-sm text-muted-foreground">
                    No direct referrals yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your referral link to grow your team
                  </p>
                </div>
              )}

              {/* Genealogy tree */}
              {tree && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      Team Structure
                    </p>
                  </div>
                  <div
                    className="bg-card border border-border rounded-xl p-4 overflow-x-auto"
                    data-ocid="team-tree"
                  >
                    <div className="flex justify-center min-w-[200px]">
                      <TreeNodeBox node={tree} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
