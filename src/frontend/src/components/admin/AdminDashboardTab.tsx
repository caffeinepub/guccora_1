import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Clock,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdminAuditLog, useAdminStats } from "../../hooks/useBackend";

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  loading,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`border border-border ${highlight ? "bg-primary/5 border-primary/20" : "bg-card"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p
                className={`text-xl font-display font-bold truncate ${highlight ? "text-primary" : "text-foreground"}`}
              >
                {value}
              </p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${highlight ? "bg-primary/15 border border-primary/30" : "bg-muted border border-border"}`}
          >
            <Icon
              className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardTab() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: auditLog, isLoading: auditLoading } = useAdminAuditLog();

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard
          label="Total Revenue"
          value={stats ? formatRupees(stats.totalRevenue) : "₹0.00"}
          icon={DollarSign}
          loading={statsLoading}
          highlight
        />
        <KpiCard
          label="Net Profit"
          value={stats ? formatRupees(stats.netProfit) : "₹0.00"}
          icon={TrendingUp}
          loading={statsLoading}
          highlight
        />
        <KpiCard
          label="Commissions Paid"
          value={stats ? formatRupees(stats.totalCommissionsPaid) : "₹0.00"}
          icon={BarChart3}
          loading={statsLoading}
        />
        <KpiCard
          label="Active Users"
          value={stats ? String(stats.totalUsers) : "0"}
          icon={Users}
          loading={statsLoading}
        />
        <KpiCard
          label="Pending Orders"
          value={stats ? String(stats.pendingOrders) : "0"}
          icon={ShoppingBag}
          loading={statsLoading}
        />
        <KpiCard
          label="Pending Withdrawals"
          value={stats ? String(stats.pendingWithdrawals) : "0"}
          icon={Clock}
          loading={statsLoading}
        />
      </div>

      {/* Audit Log */}
      <Card className="bg-card border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Activity
          </h3>
          {auditLog && (
            <Badge
              variant="outline"
              className="border-border text-muted-foreground text-xs"
            >
              {auditLog.length} entries
            </Badge>
          )}
        </div>
        <CardContent className="p-0">
          {auditLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : auditLog && auditLog.length > 0 ? (
            <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
              {auditLog.slice(0, 30).map((log) => (
                <div
                  key={String(log.id)}
                  className="px-5 py-3 hover:bg-muted/20 transition-colors"
                  data-ocid="admin-audit-row"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {log.details}
                      </p>
                      {log.targetUserId && (
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5 truncate">
                          Target: {log.targetUserId.slice(0, 24)}…
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {new Date(
                        Number(log.timestamp) / 1_000_000,
                      ).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No admin activity recorded yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
