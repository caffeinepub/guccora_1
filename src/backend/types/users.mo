import Common "common";
import Set "mo:core/Set";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type UserStatus = { #active; #inactive; #hold };

  public type BankDetails = {
    accountNumber : Text;
    ifsc : Text;
    accountHolderName : Text;
  };

  public type User = {
    id : UserId;
    var name : Text;
    referralCode : Text;
    var mobileNumber : Text;
    var passwordHash : Text;
    var sponsorId : ?UserId;
    var position : Text;
    var leftChild : ?UserId;
    var rightChild : ?UserId;
    var walletBalance : Nat;
    var directIncome : Nat;
    var levelIncome : Nat;
    var pairIncome : Nat;
    var totalIncome : Nat;
    createdAt : Timestamp;
    var isAdmin : Bool;
    var status : UserStatus;
    var bankDetails : ?BankDetails;
    var upiId : ?Text;
    // Tracks which left+right pairing keys have already been awarded pair income.
    // Key format: "<leftChildId>:<rightChildId>" — prevents duplicate pair payouts across orders.
    var pairPaid : Set.Set<Text>;
  };

  // Shared (immutable) version of User for public API
  public type UserPublic = {
    id : UserId;
    name : Text;
    referralCode : Text;
    mobileNumber : Text;
    sponsorId : ?UserId;
    position : Text;
    leftChild : ?UserId;
    rightChild : ?UserId;
    walletBalance : Nat;
    directIncome : Nat;
    levelIncome : Nat;
    pairIncome : Nat;
    totalIncome : Nat;
    createdAt : Timestamp;
    isAdmin : Bool;
    status : UserStatus;
    hasBankDetails : Bool;
    hasUpiId : Bool;
  };

  public type WalletInfo = {
    balance : Nat;
    directIncome : Nat;
    levelIncome : Nat;
    pairIncome : Nat;
    totalIncome : Nat;
  };

  public type PaymentDetails = {
    bankDetails : ?BankDetails;
    upiId : ?Text;
  };

  public type TreeNode = {
    user : UserId;
    name : Text;
    children : [TreeNode];
  };
};
