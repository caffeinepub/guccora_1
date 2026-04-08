import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type WithdrawStatus = { #pending; #approved; #rejected };

  public type WithdrawRequest = {
    id : Nat;
    user : UserId;
    amount : Nat;
    var status : WithdrawStatus;
    requestedAt : Timestamp;
    var processedAt : ?Timestamp;
  };

  // Shared (immutable) version for public API
  public type WithdrawRequestPublic = {
    id : Nat;
    user : UserId;
    amount : Nat;
    status : WithdrawStatus;
    requestedAt : Timestamp;
    processedAt : ?Timestamp;
  };
};
