import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import UserTypes "types/users";
import OrderTypes "types/orders";

module {
  // ── Old inline type definitions (from .old/src/backend/types/) ──

  type OldUserId = Principal;
  type OldTimestamp = Int;

  type OldUser = {
    id : OldUserId;
    var name : Text;
    referralCode : Text;
    var sponsorId : ?OldUserId;
    var leftChild : ?OldUserId;
    var rightChild : ?OldUserId;
    var walletBalance : Nat;
    var directIncome : Nat;
    var levelIncome : Nat;
    var pairIncome : Nat;
    var totalIncome : Nat;
    createdAt : OldTimestamp;
    var isAdmin : Bool;
  };

  type OldOrder = {
    id : Nat;
    buyer : OldUserId;
    planId : Nat;
    planPrice : Nat;
    timestamp : OldTimestamp;
  };

  type OldWithdrawStatus = { #pending; #approved; #rejected };

  type OldWithdrawRequest = {
    id : Nat;
    user : OldUserId;
    amount : Nat;
    var status : OldWithdrawStatus;
    requestedAt : OldTimestamp;
    var processedAt : ?OldTimestamp;
  };

  type OldCommissionType = { #direct; #level; #pair };

  type OldCommissionRecord = {
    id : Nat;
    orderId : Nat;
    recipient : OldUserId;
    amount : Nat;
    commType : OldCommissionType;
    level : Nat;
    timestamp : OldTimestamp;
  };

  type OldAdminWallet = {
    var totalReceived : Nat;
    var totalCommissionsPaid : Nat;
    var netProfit : Nat;
  };

  // ── Old actor state ──

  type OldActor = {
    users : Map.Map<OldUserId, OldUser>;
    referralIndex : Map.Map<Text, OldUserId>;
    orders : List.List<OldOrder>;
    commissions : List.List<OldCommissionRecord>;
    purchasedSet : List.List<OldUserId>;
    adminWallet : OldAdminWallet;
    withdrawals : List.List<OldWithdrawRequest>;
    var nextOrderId : Nat;
    var nextCommissionId : Nat;
    var nextWithdrawalId : Nat;
    plans : [(Nat, Nat)]; // consumed and dropped — replaced by products List
  };

  // ── New actor state (only fields that need migration; new fields get actor defaults) ──

  type NewUser = UserTypes.User;
  type NewOrder = OrderTypes.Order;

  type NewActor = {
    users : Map.Map<UserTypes.UserId, NewUser>;
    referralIndex : Map.Map<Text, UserTypes.UserId>;
    orders : List.List<NewOrder>;
    commissions : List.List<OrderTypes.CommissionRecord>;
    purchasedSet : List.List<UserTypes.UserId>;
    adminWallet : OrderTypes.AdminWallet;
    withdrawals : List.List<OldWithdrawRequest>; // shape unchanged
    var nextOrderId : Nat;
    var nextCommissionId : Nat;
    var nextWithdrawalId : Nat;
  };

  // ── Migration function ──

  public func run(old : OldActor) : NewActor {
    // Migrate users: add new fields with safe defaults
    let newUsers = old.users.map<OldUserId, OldUser, NewUser>(
      func(_id, u) : NewUser {
        {
          id = u.id;
          var name = u.name;
          referralCode = u.referralCode;
          var mobileNumber = ""; // legacy users have no mobile — admin can reset
          var passwordHash = ""; // legacy users — will need to re-register or admin reset
          var sponsorId = u.sponsorId;
          var leftChild = u.leftChild;
          var rightChild = u.rightChild;
          var walletBalance = u.walletBalance;
          var directIncome = u.directIncome;
          var levelIncome = u.levelIncome;
          var pairIncome = u.pairIncome;
          var totalIncome = u.totalIncome;
          createdAt = u.createdAt;
          var isAdmin = u.isAdmin;
          var status = #active; // existing users default to active
          var bankDetails = null;
          var upiId = null;
        }
      }
    );

    // Migrate orders: add new fields with safe defaults
    let newOrders = old.orders.map<OldOrder, NewOrder>(
      func(o) : NewOrder {
        {
          id = o.id;
          buyer = o.buyer;
          planId = o.planId;
          planPrice = o.planPrice;
          timestamp = o.timestamp;
          deliveryAddress = ""; // legacy orders had no address
          utrScreenshotUrl = null;
          var status = #approved; // legacy orders were auto-approved
          var rejectionReason = null;
        }
      }
    );

    {
      users = newUsers;
      referralIndex = old.referralIndex;
      orders = newOrders;
      commissions = old.commissions;
      purchasedSet = old.purchasedSet;
      adminWallet = old.adminWallet;
      withdrawals = old.withdrawals;
      var nextOrderId = old.nextOrderId;
      var nextCommissionId = old.nextCommissionId;
      var nextWithdrawalId = old.nextWithdrawalId;
    };
  };
};
