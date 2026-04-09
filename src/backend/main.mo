import Map "mo:core/Map";
import List "mo:core/List";
import UserTypes "types/users";
import OrderTypes "types/orders";
import PlanTypes "types/plans";
import WithdrawalTypes "types/withdrawals";
import NotifTypes "types/notifications";
import AuditTypes "types/audit";


import UsersMixin "mixins/users-api";
import PlansMixin "mixins/plans-api";
import OrdersMixin "mixins/orders-api";
import WithdrawalsMixin "mixins/withdrawals-api";
import AdminMixin "mixins/admin-api";




actor {
  // --- Shared state ---
  // UserId = Text (mobile number) — no IC identity required
  let users = Map.empty<UserTypes.UserId, UserTypes.User>();
  let referralIndex = Map.empty<Text, UserTypes.UserId>();
  let mobileIndex = Map.empty<Text, UserTypes.UserId>();

  let products = List.empty<PlanTypes.Product>();

  let orders = List.empty<OrderTypes.Order>();
  let commissions = List.empty<OrderTypes.CommissionRecord>();
  let purchasedSet = List.empty<UserTypes.UserId>();

  let adminWallet : OrderTypes.AdminWallet = {
    var totalReceived = 0;
    var totalCommissionsPaid = 0;
    var netProfit = 0;
  };

  let withdrawals = List.empty<WithdrawalTypes.WithdrawRequest>();
  let notifications = List.empty<NotifTypes.Notification>();
  let auditLog = List.empty<AuditTypes.AuditLog>();

  let nextOrderId : Nat = 1;
  let nextCommissionId : Nat = 1;
  let nextWithdrawalId : Nat = 1;
  let nextNotificationId : Nat = 1;
  let nextAuditId : Nat = 1;
  var nextProductId : Nat = 1;

  // --- Seed default products if none exist ---
  if (products.size() == 0) {
    products.add({ id = 1; var name = "Silver";   var price = 599;  var imageUrl : ?Text = null; var isActive = true });
    products.add({ id = 2; var name = "Gold";     var price = 999;  var imageUrl : ?Text = null; var isActive = true });
    products.add({ id = 3; var name = "Platinum"; var price = 1999; var imageUrl : ?Text = null; var isActive = true });
    products.add({ id = 4; var name = "Diamond";  var price = 2999; var imageUrl : ?Text = null; var isActive = true });
    nextProductId := 5;
  };

  // --- Mixin composition ---
  include UsersMixin(users, referralIndex, mobileIndex, notifications, nextNotificationId);
  include PlansMixin(users, products, nextProductId);
  include OrdersMixin(users, referralIndex, products, orders, commissions, purchasedSet, adminWallet, notifications, auditLog, nextOrderId, nextCommissionId, nextNotificationId, nextAuditId);
  include WithdrawalsMixin(users, withdrawals, nextWithdrawalId);
  include AdminMixin(users, mobileIndex, orders, withdrawals, adminWallet, notifications, auditLog);
};
