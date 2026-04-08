import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import UserTypes "../types/users";
import WithdrawalTypes "../types/withdrawals";
import WithdrawLib "../lib/withdrawals";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  withdrawals : List.List<WithdrawalTypes.WithdrawRequest>,
  nextWithdrawalId : Nat,
) {
  /// Submit a withdrawal request for the caller.
  /// Requires bank details or UPI ID to be saved.
  public shared ({ caller }) func requestWithdrawal(amount : Nat) : async { #ok : WithdrawalTypes.WithdrawRequestPublic; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous caller not allowed");
    if (amount == 0) return #err("Amount must be greater than 0");

    switch (users.get(caller)) {
      case null { #err("User not found") };
      case (?user) {
        // Validate payment method is saved
        if (user.bankDetails == null and user.upiId == null) {
          return #err("Please add bank details or UPI ID first before requesting withdrawal");
        };

        if (amount > user.walletBalance) return #err("Insufficient balance");

        // Only one pending request at a time
        let pendingOpt = withdrawals.find(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
          Principal.equal(r.user, caller) and r.status == #pending
        });
        let hasPending = switch (pendingOpt) { case (?_) true; case null false };
        if (hasPending) return #err("You already have a pending withdrawal request");

        let reqId = withdrawals.size() + 1;
        let req = WithdrawLib.newRequest(reqId, caller, amount);
        withdrawals.add(req);
        #ok(WithdrawLib.toPublic(req));
      };
    };
  };

  /// Get the caller's withdrawal history
  public shared query ({ caller }) func getMyWithdrawals() : async [WithdrawalTypes.WithdrawRequestPublic] {
    withdrawals
      .filter(func(r : WithdrawalTypes.WithdrawRequest) : Bool {
        Principal.equal(r.user, caller)
      })
      .map<WithdrawalTypes.WithdrawRequest, WithdrawalTypes.WithdrawRequestPublic>(func(r : WithdrawalTypes.WithdrawRequest) : WithdrawalTypes.WithdrawRequestPublic {
        WithdrawLib.toPublic(r)
      })
      .toArray();
  };
};
