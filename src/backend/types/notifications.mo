import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type Notification = {
    id : Nat;
    recipientId : ?UserId;
    message : Text;
    timestamp : Timestamp;
    var isRead : Bool;
  };

  // Shared (immutable) version for public API
  public type NotificationPublic = {
    id : Nat;
    recipientId : ?UserId;
    message : Text;
    timestamp : Timestamp;
    isRead : Bool;
  };
};
