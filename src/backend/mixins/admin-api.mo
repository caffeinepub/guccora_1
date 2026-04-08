import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import UserTypes "../types/users";
import OrderTypes "../types/orders";
import WithdrawalTypes "../types/withdrawals";
import NotifTypes "../types/notifications";
import AuditTypes "../types/audit";
import UserLib "../lib/users";
import WithdrawLib "../lib/withdrawals";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  mobileIndex : Map.Map<Text, UserTypes.UserId>,
  orders : List.List<OrderTypes.Order>,
  withdrawals : List.List<WithdrawalTypes.WithdrawRequest>,
  adminWallet : OrderTypes.AdminWallet,
  notifications : List.List<NotifTypes.Notification>,
  auditLog : List.List<AuditTypes.AuditLog>,
) {
  // Hardcoded admin credentials for frontend login gate
  let ADMIN_ID : Text = "6305462887";
  let ADMIN_PASSWORD : Text = "guccora@8433";

  func isAdminCaller(caller : UserTypes.UserId) : Bool {
    switch (users.get(caller)) {
      case (?u) u.isAdmin;
      case null false;
    };
  };

  func addAdminAudit(action : Text, targetUserId : ?UserTypes.UserId, details : Text) {
    let id = auditLog.size() + 1;
    auditLog.add({
      id;
      action;
      targetUserId;
      details;
      timestamp = Time.now();
    });
  };

  /// Validate admin credentials (frontend login gate — does NOT use IC principal auth)
  public shared func adminLogin(adminId : Text, password : Text) : async { #ok : (); #err : Text } {
    if (adminId == ADMIN_ID and password == ADMIN_PASSWORD) {
      #ok(());
    } else {
      #err("Invalid admin credentials");
    };
  };

  /// Get all users (admin only)
  public shared query ({ caller }) func adminGetAllUsers() : async { #ok : [UserTypes.UserPublic]; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let result = users.values()
      .map(func(u : UserTypes.User) : UserTypes.UserPublic { UserLib.toPublic(u) })
      .toArray();
    #ok(result);
  };

  /// Set user status (admin only): #active | #inactive | #hold
  public shared ({ caller }) func setUserStatus(
    userId : UserTypes.UserId,
    status : UserTypes.UserStatus,
  ) : async { #ok : (); #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        let oldStatus = user.status;
        user.status := status;
        let statusText = switch (status) {
          case (#active) "active";
          case (#inactive) "inactive";
          case (#hold) "hold";
        };
        let oldStatusText = switch (oldStatus) {
          case (#active) "active";
          case (#inactive) "inactive";
          case (#hold) "hold";
        };
        addAdminAudit(
          "USER_STATUS_CHANGE",
          ?userId,
          "Status changed from " # oldStatusText # " to " # statusText,
        );
        #ok(());
      };
    };
  };

  /// Reset a user's password (admin only)
  public shared ({ caller }) func resetUserPassword(
    userId : UserTypes.UserId,
    newPassword : Text,
  ) : async { #ok : (); #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    if (newPassword.size() == 0) return #err("Password cannot be empty");
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        user.passwordHash := newPassword;
        addAdminAudit("PASSWORD_RESET", ?userId, "Password reset by admin");
        #ok(());
      };
    };
  };

  /// Get all orders (admin only) — all statuses
  public shared query ({ caller }) func adminGetAllOrders() : async { #ok : [OrderTypes.OrderPublic]; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let result = orders
      .map<OrderTypes.Order, OrderTypes.OrderPublic>(func(o : OrderTypes.Order) : OrderTypes.OrderPublic {
        {
          id = o.id;
          buyer = o.buyer;
          planId = o.planId;
          planPrice = o.planPrice;
          timestamp = o.timestamp;
          deliveryAddress = o.deliveryAddress;
          utrScreenshotUrl = o.utrScreenshotUrl;
          status = o.status;
          rejectionReason = o.rejectionReason;
        };
      })
      .toArray();
    #ok(result);
  };

  /// Get all withdrawal requests (admin only)
  public shared query ({ caller }) func adminGetAllWithdrawals() : async { #ok : [WithdrawalTypes.WithdrawRequestPublic]; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let result = withdrawals
      .map<WithdrawalTypes.WithdrawRequest, WithdrawalTypes.WithdrawRequestPublic>(func(r : WithdrawalTypes.WithdrawRequest) : WithdrawalTypes.WithdrawRequestPublic {
        WithdrawLib.toPublic(r)
      })
      .toArray();
    #ok(result);
  };

  /// Approve a withdrawal request (admin only)
  public shared ({ caller }) func adminApproveWithdrawal(requestId : Nat) : async { #ok : (); #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let reqOpt = withdrawals.find(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
      r.id == requestId
    });
    switch (reqOpt) {
      case null { #err("Withdrawal request not found") };
      case (?req) {
        if (req.status != #pending) return #err("Request is not pending");
        switch (users.get(req.user)) {
          case null { #err("User not found") };
          case (?user) {
            if (req.amount > user.walletBalance) return #err("Insufficient user balance");
            WithdrawLib.approve(req, user);
            addAdminAudit("WITHDRAWAL_APPROVED", ?req.user, "Withdrawal #" # req.id.toText() # " approved, amount: " # req.amount.toText());
            #ok(());
          };
        };
      };
    };
  };

  /// Reject a withdrawal request (admin only)
  public shared ({ caller }) func adminRejectWithdrawal(requestId : Nat) : async { #ok : (); #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let reqOpt = withdrawals.find(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
      r.id == requestId
    });
    switch (reqOpt) {
      case null { #err("Withdrawal request not found") };
      case (?req) {
        if (req.status != #pending) return #err("Request is not pending");
        WithdrawLib.reject(req);
        addAdminAudit("WITHDRAWAL_REJECTED", ?req.user, "Withdrawal #" # req.id.toText() # " rejected");
        #ok(());
      };
    };
  };

  /// Send a notification to a user or broadcast to all (admin only)
  public shared ({ caller }) func adminSendNotification(
    recipientId : ?UserTypes.UserId,
    message : Text,
  ) : async { #ok : (); #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    if (message.size() == 0) return #err("Message cannot be empty");
    let id = notifications.size() + 1;
    notifications.add({
      id;
      recipientId;
      message;
      timestamp = Time.now();
      var isRead = false;
    });
    addAdminAudit("NOTIFICATION_SENT", recipientId, message);
    #ok(());
  };

  /// Get all sent notifications (admin view)
  public shared query ({ caller }) func adminGetNotificationHistory() : async { #ok : [NotifTypes.NotificationPublic]; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let result = notifications
      .map<NotifTypes.Notification, NotifTypes.NotificationPublic>(func(n : NotifTypes.Notification) : NotifTypes.NotificationPublic {
        {
          id = n.id;
          recipientId = n.recipientId;
          message = n.message;
          timestamp = n.timestamp;
          isRead = n.isRead;
        };
      })
      .toArray();
    #ok(result);
  };

  /// Get recent audit log entries (admin only)
  public shared query ({ caller }) func adminGetAuditLog() : async { #ok : [AuditTypes.AuditLog]; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    #ok(auditLog.toArray());
  };

  /// Get platform statistics (admin only)
  public shared query ({ caller }) func adminGetStats() : async { #ok : OrderTypes.AdminStats; #err : Text } {
    if (not isAdminCaller(caller)) return #err("Unauthorized");
    let pendingWithdrawals = withdrawals.filter(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
      r.status == #pending
    }).size();
    let pendingOrders = orders.filter(func(o : OrderTypes.Order) : Bool {
      o.status == #pendingApproval
    }).size();
    #ok({
      totalUsers = users.size();
      totalOrders = orders.size();
      totalRevenue = adminWallet.totalReceived;
      totalCommissionsPaid = adminWallet.totalCommissionsPaid;
      netProfit = adminWallet.netProfit;
      pendingWithdrawals;
      pendingOrders;
    });
  };
};
