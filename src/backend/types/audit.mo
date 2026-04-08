import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type AuditLog = {
    id : Nat;
    action : Text;
    targetUserId : ?UserId;
    details : Text;
    timestamp : Timestamp;
  };
};
