import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  ClipboardList,
  LogOut,
  Package,
  Shield,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import AdminDashboardTab from "../components/admin/AdminDashboardTab";
import AdminNotificationsTab from "../components/admin/AdminNotificationsTab";
import AdminOrdersTab from "../components/admin/AdminOrdersTab";
import AdminProductsTab from "../components/admin/AdminProductsTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminWithdrawalsTab from "../components/admin/AdminWithdrawalsTab";
import { useAuth } from "../hooks/useAuth";
import {
  useAdminPendingOrders,
  useAdminStats,
  useAdminWithdrawals,
} from "../hooks/useBackend";
import { OrderStatus, WithdrawStatus } from "../types";

export default function AdminPage() {
  const { isAdmin, isInitializing, logout } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useAdminStats();
  const { data: pendingOrders } = useAdminPendingOrders();
  const { data: withdrawals } = useAdminWithdrawals();

  useEffect(() => {
    if (!isInitializing && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, isInitializing, navigate]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin-login" });
  };

  const pendingOrdersCount =
    pendingOrders?.filter((o) => o.status === OrderStatus.pendingApproval)
      .length ?? 0;
  const pendingWithdrawalsCount =
    withdrawals?.filter((w) => w.status === WithdrawStatus.pending).length ?? 0;

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-background">
      {/* Admin Header */}
      <section className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-primary leading-tight tracking-wide">
                GUCCORA ADMIN PANEL
              </h1>
              <p className="text-xs text-muted-foreground">
                Control center · Secure access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stats && (
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <span className="text-xs text-muted-foreground">
                  <span className="text-primary font-semibold">
                    {String(stats.totalUsers)}
                  </span>{" "}
                  users
                </span>
                <span className="text-xs text-muted-foreground">
                  <span className="text-primary font-semibold">
                    ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
                  </span>{" "}
                  revenue
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 h-8 border-border text-muted-foreground hover:text-foreground"
              data-ocid="admin-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 py-6">
        <div className="container max-w-6xl mx-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList
              className="flex flex-wrap h-auto gap-1 bg-muted/40 border border-border p-1 rounded-xl mb-6 w-full"
              data-ocid="admin-tabs"
            >
              <TabsTrigger
                value="dashboard"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-dashboard"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-products"
              >
                <Package className="h-3.5 w-3.5" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-users"
              >
                <Users className="h-3.5 w-3.5" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-orders"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Orders
                {pendingOrdersCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1 ml-0.5">
                    {pendingOrdersCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-withdrawals"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Withdrawals</span>
                <span className="sm:hidden">Withdraw</span>
                {pendingWithdrawalsCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1 ml-0.5">
                    {pendingWithdrawalsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-notifications"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Notify</span>
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="flex-1 min-w-[80px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 py-2"
                data-ocid="admin-tab-audit"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Audit Log</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AdminDashboardTab />
            </TabsContent>
            <TabsContent value="products">
              <AdminProductsTab />
            </TabsContent>
            <TabsContent value="users">
              <AdminUsersTab />
            </TabsContent>
            <TabsContent value="orders">
              <AdminOrdersTab />
            </TabsContent>
            <TabsContent value="withdrawals">
              <AdminWithdrawalsTab />
            </TabsContent>
            <TabsContent value="notifications">
              <AdminNotificationsTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
