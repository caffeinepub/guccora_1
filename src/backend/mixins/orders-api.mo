import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import UserTypes "../types/users";
import OrderTypes "../types/orders";
import PlanTypes "../types/plans";
import NotifTypes "../types/notifications";
import AuditTypes "../types/audit";
import CommissionsLib "../lib/commissions";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  referralIndex : Map.Map<Text, UserTypes.UserId>,
  products : List.List<PlanTypes.Product>,
  orders : List.List<OrderTypes.Order>,
  commissions : List.List<OrderTypes.CommissionRecord>,
  purchasedSet : List.List<UserTypes.UserId>,
  adminWallet : OrderTypes.AdminWallet,
  notifications : List.List<NotifTypes.Notification>,
  auditLog : List.List<AuditTypes.AuditLog>,
  nextOrderId : Nat,
  nextCommissionId : Nat,
  nextNotificationId : Nat,
  nextAuditId : Nat,
) {
  let ORDERS_ADMIN_ID : Text = "6305462887";
  let ORDERS_ADMIN_PASSWORD : Text = "guccora@8433";

  func isOrdersAdmin(adminId : Text, password : Text) : Bool {
    adminId == ORDERS_ADMIN_ID and password == ORDERS_ADMIN_PASSWORD;
  };

  func getProductById(productId : Nat) : ?PlanTypes.Product {
    products.find(func(p : PlanTypes.Product) : Bool { p.id == productId and p.isActive });
  };

  func addAudit(action : Text, targetUserId : ?UserTypes.UserId, details : Text) {
    let id = auditLog.size() + 1;
    auditLog.add({
      id;
      action;
      targetUserId;
      details;
      timestamp = Time.now();
    });
  };

  func sendNotification(recipientId : ?UserTypes.UserId, message : Text) {
    let id = notifications.size() + 1;
    notifications.add({
      id;
      recipientId;
      message;
      timestamp = Time.now();
      var isRead = false;
    });
  };

  /// Purchase a product — creates order with #pendingApproval status.
  /// Commissions are NOT distributed until admin approves the order.
  /// userId is the mobile number (received from login).
  public shared func purchasePlan(
    userId : UserTypes.UserId,
    productId : Nat,
    deliveryAddress : Text,
    utrScreenshotUrl : ?Text,
  ) : async { #ok : OrderTypes.OrderPublic; #err : Text } {
    if (userId.size() == 0) return #err("User ID is required");
    if (not users.containsKey(userId)) return #err("User not registered");
    if (deliveryAddress.size() == 0) return #err("Delivery address is required");

    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        if (user.status == #inactive) return #err("Account is inactive");
        switch (getProductById(productId)) {
          case null { #err("Invalid product or product not available") };
          case (?product) {
            let orderId = orders.size() + 1;
            let order : OrderTypes.Order = {
              id = orderId;
              buyer = userId;
              planId = productId;
              planPrice = product.price;
              timestamp = Time.now();
              deliveryAddress;
              utrScreenshotUrl;
              var status = #pendingApproval;
              var rejectionReason = null;
            };
            orders.add(order);
            #ok({
              id = order.id;
              buyer = order.buyer;
              planId = order.planId;
              planPrice = order.planPrice;
              timestamp = order.timestamp;
              deliveryAddress = order.deliveryAddress;
              utrScreenshotUrl = order.utrScreenshotUrl;
              status = order.status;
              rejectionReason = order.rejectionReason;
            });
          };
        };
      };
    };
  };

  /// Admin approves an order — records revenue, distributes commissions
  public shared func adminApproveOrder(adminId : Text, password : Text, orderId : Nat) : async { #ok : (); #err : Text } {
    if (not isOrdersAdmin(adminId, password)) return #err("Unauthorized");

    let orderOpt = orders.find(func(o : OrderTypes.Order) : Bool { o.id == orderId });
    switch (orderOpt) {
      case null { #err("Order not found") };
      case (?order) {
        if (order.status != #pendingApproval) return #err("Order is not pending approval");

        // Mark order approved
        order.status := #approved;

        // Record full plan price to adminWallet
        adminWallet.totalReceived += order.planPrice;

        // Add buyer to purchasedSet (before commission to allow pair qualification)
        purchasedSet.add(order.buyer);

        // Distribute commissions
        let nextCommId = commissions.size() + 1;
        let newCommissions = CommissionsLib.distributeCommissions(
          order,
          users,
          adminWallet,
          purchasedSet,
          nextCommId,
        );
        for (c in newCommissions.vals()) {
          commissions.add(c);
        };

        addAudit("ORDER_APPROVED", ?order.buyer, "Order #" # order.id.toText() # " approved");
        #ok(());
      };
    };
  };

  /// Admin rejects an order
  public shared func adminRejectOrder(adminId : Text, password : Text, orderId : Nat, reason : Text) : async { #ok : (); #err : Text } {
    if (not isOrdersAdmin(adminId, password)) return #err("Unauthorized");

    let orderOpt = orders.find(func(o : OrderTypes.Order) : Bool { o.id == orderId });
    switch (orderOpt) {
      case null { #err("Order not found") };
      case (?order) {
        if (order.status != #pendingApproval) return #err("Order is not pending approval");
        order.status := #rejected;
        order.rejectionReason := ?reason;
        sendNotification(?order.buyer, "Your order #" # order.id.toText() # " has been rejected. Reason: " # reason);
        addAudit("ORDER_REJECTED", ?order.buyer, "Order #" # order.id.toText() # " rejected. Reason: " # reason);
        #ok(());
      };
    };
  };

  /// Get all orders for a userId (mobile number)
  public query func getMyOrders(userId : UserTypes.UserId) : async [OrderTypes.OrderPublic] {
    orders
      .filter(func(o : OrderTypes.Order) : Bool { o.buyer == userId })
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
  };

  /// Get all orders with pending approval status (admin only)
  public shared func adminGetPendingOrders(adminId : Text, password : Text) : async { #ok : [OrderTypes.OrderPublic]; #err : Text } {
    if (not isOrdersAdmin(adminId, password)) return #err("Unauthorized");
    let result = orders
      .filter(func(o : OrderTypes.Order) : Bool { o.status == #pendingApproval })
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
};
