import Map "mo:core/Map";
import List "mo:core/List";
import UserTypes "../types/users";
import WithdrawalTypes "../types/withdrawals";
import WithdrawLib "../lib/withdrawals";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  withdrawals : List.List<WithdrawalTypes.WithdrawRequest>,
  nextWithdrawalId : Nat,
) {
  /// Submit a withdrawal request for a userId (mobile number).
  /// Requires bank details or UPI ID to be saved.
  public shared func requestWithdrawal(userId : UserTypes.UserId, amount : Nat) : async { #ok : WithdrawalTypes.WithdrawRequestPublic; #err : Text } {
    if (userId.size() == 0) return #err("User ID is required");
    if (amount == 0) return #err("Amount must be greater than 0");

    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        // Validate payment method is saved
        if (user.bankDetails == null and user.upiId == null) {
          return #err("Please add bank details or UPI ID first before requesting withdrawal");
        };

        if (amount > user.walletBalance) return #err("Insufficient balance");

        // Only one pending request at a time
        let pendingOpt = withdrawals.find(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
          r.user == userId and r.status == #pending
        });
        let hasPending = switch (pendingOpt) { case (?_) true; case null false };
        if (hasPending) return #err("You already have a pending withdrawal request");

        let reqId = withdrawals.size() + 1;
        let req = WithdrawLib.newRequest(reqId, userId, amount);
        withdrawals.add(req);
        #ok(WithdrawLib.toPublic(req));
      };
    };
  };

  /// Get the withdrawal history for a userId (mobile number)
  public query func getMyWithdrawals(userId : UserTypes.UserId) : async [WithdrawalTypes.WithdrawRequestPublic] {
    withdrawals
      .filter(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
        r.user == userId
      })
      .map<WithdrawalTypes.WithdrawRequest, WithdrawalTypes.WithdrawRequestPublic>(func(r : WithdrawalTypes.WithdrawRequest) : WithdrawalTypes.WithdrawRequestPublic {
        WithdrawLib.toPublic(r)
      })
      .toArray();
  };
};
