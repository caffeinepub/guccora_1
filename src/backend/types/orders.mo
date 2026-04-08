import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type OrderStatus = { #pendingApproval; #approved; #rejected };

  public type Order = {
    id : Nat;
    buyer : UserId;
    planId : Nat;
    planPrice : Nat;
    timestamp : Timestamp;
    deliveryAddress : Text;
    utrScreenshotUrl : ?Text;
    var status : OrderStatus;
    var rejectionReason : ?Text;
  };

  // Shared (immutable) version for public API
  public type OrderPublic = {
    id : Nat;
    buyer : UserId;
    planId : Nat;
    planPrice : Nat;
    timestamp : Timestamp;
    deliveryAddress : Text;
    utrScreenshotUrl : ?Text;
    status : OrderStatus;
    rejectionReason : ?Text;
  };

  public type CommissionType = { #direct; #level; #pair };

  public type CommissionRecord = {
    id : Nat;
    orderId : Nat;
    recipient : UserId;
    amount : Nat;
    commType : CommissionType;
    level : Nat;
    timestamp : Timestamp;
  };

  public type AdminWallet = {
    var totalReceived : Nat;
    var totalCommissionsPaid : Nat;
    var netProfit : Nat;
  };

  public type AdminStats = {
    totalUsers : Nat;
    totalOrders : Nat;
    totalRevenue : Nat;
    totalCommissionsPaid : Nat;
    netProfit : Nat;
    pendingWithdrawals : Nat;
    pendingOrders : Nat;
  };
};
