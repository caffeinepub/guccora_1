import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, KeyRound, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminUsers,
  useResetUserPassword,
  useSetUserStatus,
} from "../../hooks/useBackend";
import { UserStatus } from "../../types";
import type { User, UserId } from "../../types";

function formatRupees(value: bigint) {
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: User["status"] }) {
  if (status === UserStatus.active)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
        Active
      </Badge>
    );
  if (status === UserStatus.hold)
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-xs">
        Hold
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground border-border text-xs"
    >
      Inactive
    </Badge>
  );
}

export default function AdminUsersTab() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutateAsync: setStatus, isPending: settingStatus } =
    useSetUserStatus();
  const { mutateAsync: resetPassword, isPending: resetting } =
    useResetUserPassword();

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resetDialog, setResetDialog] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [statusConfirm, setStatusConfirm] = useState<{
    user: User;
    status: User["status"];
  } | null>(null);

  const filtered = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobileNumber.includes(search) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSetStatus = async (userId: UserId, status: User["status"]) => {
    try {
      await setStatus({ userId, status });
      toast.success(`User status updated to ${status}`);
      setStatusConfirm(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

  const handleResetPassword = async () => {
    if (!resetDialog || !newPassword.trim()) {
      toast.error("Enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await resetPassword({ userId: resetDialog.id, newPassword });
      toast.success(`Password reset for ${resetDialog.name}`);
      setResetDialog(null);
      setNewPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-display font-semibold text-foreground">
            User Management
          </h2>
          <p className="text-xs text-muted-foreground">
            {users?.length ?? 0} registered users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, mobile, or referral code…"
          className="pl-9 bg-card border-border"
          data-ocid="admin-users-search"
        />
      </div>

      <Card className="bg-card border border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filtered.map((user) => {
                const isExpanded = expandedId === user.id.toText();
                return (
                  <div
                    key={user.id.toText()}
                    data-ocid={`admin-user-${user.id.toText().slice(0, 8)}`}
                  >
                    {/* Row */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer text-left"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : user.id.toText())
                      }
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground text-sm truncate">
                            {user.name}
                          </p>
                          <StatusBadge status={user.status} />
                          {user.isAdmin && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          {user.mobileNumber} · {user.referralCode}
                        </p>
                      </div>

                      {/* Balance */}
                      <p className="text-sm text-primary font-semibold hidden sm:block flex-shrink-0">
                        {formatRupees(user.walletBalance)}
                      </p>

                      {/* Expand */}
                      <div className="flex-shrink-0 text-muted-foreground">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="bg-muted/20 border-t border-border/50 px-4 py-4 space-y-4">
                        {/* Income breakdown */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            {
                              label: "Wallet Balance",
                              value: formatRupees(user.walletBalance),
                            },
                            {
                              label: "Direct Income",
                              value: formatRupees(user.directIncome),
                            },
                            {
                              label: "Level Income",
                              value: formatRupees(user.levelIncome),
                            },
                            {
                              label: "Pair Income",
                              value: formatRupees(user.pairIncome),
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-card border border-border rounded-lg p-3"
                            >
                              <p className="text-xs text-muted-foreground">
                                {item.label}
                              </p>
                              <p className="text-sm font-semibold text-primary mt-0.5">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Joined:{" "}
                          {new Date(
                            Number(user.createdAt) / 1_000_000,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>

                        {/* Status controls */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
                            disabled={
                              settingStatus || user.status === UserStatus.active
                            }
                            onClick={() =>
                              setStatusConfirm({
                                user,
                                status: UserStatus.active,
                              })
                            }
                            data-ocid={`admin-activate-${user.id.toText().slice(0, 8)}`}
                          >
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-border text-muted-foreground hover:bg-muted"
                            disabled={
                              settingStatus ||
                              user.status === UserStatus.inactive
                            }
                            onClick={() =>
                              setStatusConfirm({
                                user,
                                status: UserStatus.inactive,
                              })
                            }
                            data-ocid={`admin-deactivate-${user.id.toText().slice(0, 8)}`}
                          >
                            Deactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10"
                            disabled={
                              settingStatus || user.status === UserStatus.hold
                            }
                            onClick={() =>
                              setStatusConfirm({
                                user,
                                status: UserStatus.hold,
                              })
                            }
                            data-ocid={`admin-hold-${user.id.toText().slice(0, 8)}`}
                          >
                            Hold
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5 border-border hover:bg-muted"
                            onClick={() => {
                              setResetDialog(user);
                              setNewPassword("");
                            }}
                            data-ocid={`admin-reset-pwd-${user.id.toText().slice(0, 8)}`}
                          >
                            <KeyRound className="h-3 w-3" />
                            Reset Password
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                {search
                  ? "No users match your search"
                  : "No users registered yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Confirm Dialog */}
      <Dialog
        open={!!statusConfirm}
        onOpenChange={(o) => !o && setStatusConfirm(null)}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Change User Status
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Set status of{" "}
            <strong className="text-foreground">
              {statusConfirm?.user.name}
            </strong>{" "}
            to{" "}
            <strong className="text-foreground capitalize">
              {statusConfirm?.status}
            </strong>
            ?
            {statusConfirm?.status === UserStatus.hold && (
              <span className="block mt-1 text-yellow-600 dark:text-yellow-400 text-xs">
                ⚠ User will not receive any income while on hold.
              </span>
            )}
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusConfirm(null)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() =>
                statusConfirm &&
                handleSetStatus(statusConfirm.user.id, statusConfirm.status)
              }
              disabled={settingStatus}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin-confirm-status"
            >
              {settingStatus ? "Updating…" : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={!!resetDialog}
        onOpenChange={(o) => {
          if (!o) {
            setResetDialog(null);
            setNewPassword("");
          }
        }}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground pb-2">
            Set a new password for{" "}
            <strong className="text-foreground">{resetDialog?.name}</strong>
            <span className="text-xs block mt-0.5 font-mono text-muted-foreground">
              {resetDialog?.mobileNumber}
            </span>
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              New Password
            </Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="bg-background border-input"
              data-ocid="admin-new-password"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResetDialog(null);
                setNewPassword("");
              }}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleResetPassword}
              disabled={resetting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin-confirm-reset"
            >
              {resetting ? "Resetting…" : "Reset Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
