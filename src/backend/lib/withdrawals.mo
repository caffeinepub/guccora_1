import Time "mo:core/Time";
import WithdrawalTypes "../types/withdrawals";
import UserTypes "../types/users";

module {
  public type WithdrawRequest = WithdrawalTypes.WithdrawRequest;
  public type WithdrawRequestPublic = WithdrawalTypes.WithdrawRequestPublic;
  public type User = UserTypes.User;
  public type UserId = UserTypes.UserId;

  /// Create a new withdrawal request
  public func newRequest(id : Nat, user : UserId, amount : Nat) : WithdrawRequest {
    {
      id;
      user;
      amount;
      var status = #pending;
      requestedAt = Time.now();
      var processedAt = null;
    };
  };

  /// Convert internal mutable request to public immutable version
  public func toPublic(req : WithdrawRequest) : WithdrawRequestPublic {
    {
      id = req.id;
      user = req.user;
      amount = req.amount;
      status = req.status;
      requestedAt = req.requestedAt;
      processedAt = req.processedAt;
    };
  };

  /// Approve a withdrawal request — deducts amount from user wallet
  public func approve(req : WithdrawRequest, user : User) {
    req.status := #approved;
    req.processedAt := ?Time.now();
    user.walletBalance -= req.amount;
  };

  /// Reject a withdrawal request — no wallet change
  public func reject(req : WithdrawRequest) {
    req.status := #rejected;
    req.processedAt := ?Time.now();
  };
};
