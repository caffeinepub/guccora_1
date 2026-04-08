import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminNotificationHistory,
  useAdminSendNotification,
  useAdminUsers,
} from "../../hooks/useBackend";
import type { UserId } from "../../types";

export default function AdminNotificationsTab() {
  const { data: users } = useAdminUsers();
  const { data: history, isLoading: historyLoading } =
    useAdminNotificationHistory();
  const { mutateAsync: sendNotification, isPending: sending } =
    useAdminSendNotification();

  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "specific">("all");
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: UserId;
    name: string;
    mobile: string;
  } | null>(null);

  const filteredUsers = (users ?? []).filter(
    (u) =>
      !u.isAdmin &&
      (u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.mobileNumber.includes(searchUser)),
  );

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (recipientType === "specific" && !selectedUser) {
      toast.error("Please select a recipient");
      return;
    }
    try {
      await sendNotification({
        recipientId:
          recipientType === "specific" && selectedUser ? selectedUser.id : null,
        message: message.trim(),
      });
      toast.success(
        recipientType === "all"
          ? "Notification sent to all users"
          : `Notification sent to ${selectedUser?.name}`,
      );
      setMessage("");
      setSelectedUser(null);
      setSearchUser("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send notification",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Compose */}
      <Card className="bg-card border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            Send Notification
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Broadcast to all users or send to a specific member
          </p>
        </div>
        <CardContent className="p-5 space-y-4">
          {/* Recipient type */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Recipient</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecipientType("all");
                  setSelectedUser(null);
                  setSearchUser("");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-smooth ${
                  recipientType === "all"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/20"
                }`}
                data-ocid="admin-notify-all"
              >
                <Users className="h-4 w-4" />
                All Users
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("specific")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-smooth ${
                  recipientType === "specific"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/20"
                }`}
                data-ocid="admin-notify-specific"
              >
                <Bell className="h-4 w-4" />
                Specific User
              </button>
            </div>
          </div>

          {/* Specific user selector */}
          {recipientType === "specific" && (
            <div className="space-y-2">
              {selectedUser ? (
                <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {selectedUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedUser.mobile}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchUser("");
                    }}
                    className="text-muted-foreground hover:text-foreground text-xs"
                    aria-label="Remove selected user"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search by name or mobile…"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    data-ocid="admin-notify-search-user"
                  />
                  {searchUser && filteredUsers.length > 0 && (
                    <div className="border border-border rounded-lg bg-card max-h-40 overflow-y-auto divide-y divide-border/50">
                      {filteredUsers.slice(0, 8).map((u) => (
                        <button
                          type="button"
                          key={u.id.toText()}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors text-left"
                          onClick={() => {
                            setSelectedUser({
                              id: u.id,
                              name: u.name,
                              mobile: u.mobileNumber,
                            });
                            setSearchUser("");
                          }}
                          data-ocid={`admin-select-user-${u.id.toText().slice(0, 8)}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {u.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {u.mobileNumber}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchUser && filteredUsers.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No users found
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your notification message here…"
              className="bg-background border-input resize-none"
              rows={4}
              data-ocid="admin-notify-message"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length} characters
            </p>
          </div>

          <Button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="admin-send-notification"
          >
            <Send className="h-4 w-4" />
            {sending
              ? "Sending…"
              : recipientType === "all"
                ? "Send to All Users"
                : `Send to ${selectedUser?.name ?? "User"}`}
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="bg-card border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification History
          </h3>
          {history && (
            <Badge
              variant="outline"
              className="border-border text-muted-foreground text-xs"
            >
              {history.length} sent
            </Badge>
          )}
        </div>
        <CardContent className="p-0">
          {historyLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
              {history.slice(0, 50).map((notif) => (
                <div
                  key={String(notif.id)}
                  className="px-5 py-3 hover:bg-muted/20 transition-colors"
                  data-ocid="admin-notif-history-row"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {notif.recipientId ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-border text-muted-foreground h-4 px-1.5"
                          >
                            Direct
                          </Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] h-4 px-1.5">
                            Broadcast
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.recipientId && (
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5 truncate">
                          To: {notif.recipientId.toText().slice(0, 24)}…
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {new Date(
                        Number(notif.timestamp) / 1_000_000,
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
              <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications sent yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
