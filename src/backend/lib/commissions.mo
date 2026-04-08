import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import UserTypes "../types/users";
import OrderTypes "../types/orders";
import UserLib "users";

module {
  public type User = UserTypes.User;
  public type UserId = UserTypes.UserId;
  public type Order = OrderTypes.Order;
  public type CommissionRecord = OrderTypes.CommissionRecord;
  public type AdminWallet = OrderTypes.AdminWallet;

  public let DIRECT_INCOME : Nat = 40;
  public let LEVEL_INCOME : Nat = 5;
  public let LEVEL_DEPTH : Nat = 10;
  public let PAIR_INCOME : Nat = 3;
  public let MAX_PAYOUT_PER_ORDER : Nat = 93;

  /// Distribute all commissions for a new order.
  /// Returns list of CommissionRecords generated.
  /// Buyer wallet is NEVER touched.
  /// Skips users with status #hold or #inactive.
  public func distributeCommissions(
    order : Order,
    users : Map.Map<UserId, User>,
    adminWallet : AdminWallet,
    purchasedSet : List.List<UserId>,
    nextCommissionId : Nat,
  ) : [CommissionRecord] {
    let records = List.empty<CommissionRecord>();
    var totalPaid : Nat = 0;
    var commId = nextCommissionId;
    let now = Time.now();

    // Track which users already received pair income this order (avoid double-paying)
    let pairPaid = Set.empty<UserId>();

    // Step 1: Direct income to immediate sponsor (₹40)
    let buyerId = order.buyer;
    switch (users.get(buyerId)) {
      case null {};
      case (?buyer) {
        switch (buyer.sponsorId) {
          case null {};
          case (?sponsorId) {
            if (totalPaid + DIRECT_INCOME <= MAX_PAYOUT_PER_ORDER) {
              switch (users.get(sponsorId)) {
                case null {};
                case (?sponsor) {
                  // Fix 3: Skip direct income if sponsor is on #hold
                  if (sponsor.status != #hold) {
                    let credited = UserLib.creditWallet(sponsor, DIRECT_INCOME, #direct);
                    if (credited) {
                      adminWallet.totalCommissionsPaid += DIRECT_INCOME;
                      totalPaid += DIRECT_INCOME;
                      records.add({
                        id = commId;
                        orderId = order.id;
                        recipient = sponsorId;
                        amount = DIRECT_INCOME;
                        commType = #direct;
                        level = 0;
                        timestamp = now;
                      });
                      commId += 1;
                    };
                  };

                  // Step 2: Level income — walk up from sponsor's sponsor, 10 levels, ₹5 each
                  var current : ?UserId = sponsor.sponsorId;
                  var level = 1;
                  label levelLoop while (level <= LEVEL_DEPTH) {
                    if (totalPaid + LEVEL_INCOME > MAX_PAYOUT_PER_ORDER) break levelLoop;
                    switch (current) {
                      case null break levelLoop;
                      case (?uplineId) {
                        switch (users.get(uplineId)) {
                          case null { break levelLoop };
                          case (?upline) {
                            // Break on #inactive — do NOT propagate further up
                            if (upline.status == #inactive) {
                              break levelLoop;
                            };
                            // Fix 1: Skip #hold users but CONTINUE traversal upward
                            if (upline.status == #hold) {
                              current := upline.sponsorId;
                              level += 1;
                            } else {
                              let lvlCredited = UserLib.creditWallet(upline, LEVEL_INCOME, #level);
                              if (lvlCredited) {
                                adminWallet.totalCommissionsPaid += LEVEL_INCOME;
                                totalPaid += LEVEL_INCOME;
                                records.add({
                                  id = commId;
                                  orderId = order.id;
                                  recipient = uplineId;
                                  amount = LEVEL_INCOME;
                                  commType = #level;
                                  level;
                                  timestamp = now;
                                });
                                commId += 1;
                              };
                              current := upline.sponsorId;
                              level += 1;
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };

    // Step 3: Pair income — check the sponsor chain for pair qualification
    // For each user in the commission chain who now has BOTH children with purchases, award ₹3
    switch (users.get(buyerId)) {
      case null {};
      case (?buyer) {
        var chainUser : ?UserId = buyer.sponsorId;
        label pairLoop loop {
          if (totalPaid + PAIR_INCOME > MAX_PAYOUT_PER_ORDER) break pairLoop;
          switch (chainUser) {
            case null break pairLoop;
            case (?uid) {
              switch (users.get(uid)) {
                case null { break pairLoop };
                case (?u) {
                  if (u.status == #inactive) {
                    break pairLoop;
                  };
                  // Fix 2: Skip #hold users for pair income but CONTINUE traversal upward
                  if (u.status != #hold) {
                    // Only award pair income once per user per order
                    if (not pairPaid.contains(uid)) {
                      if (UserLib.hasPairQualified(u, purchasedSet)) {
                        let pairCredited = UserLib.creditWallet(u, PAIR_INCOME, #pair);
                        if (pairCredited) {
                          adminWallet.totalCommissionsPaid += PAIR_INCOME;
                          totalPaid += PAIR_INCOME;
                          pairPaid.add(uid);
                          records.add({
                            id = commId;
                            orderId = order.id;
                            recipient = uid;
                            amount = PAIR_INCOME;
                            commType = #pair;
                            level = 0;
                            timestamp = now;
                          });
                          commId += 1;
                        };
                      };
                    };
                  };
                  chainUser := u.sponsorId;
                };
              };
            };
          };
        };
      };
    };

    // Update admin net profit (safe subtraction)
    if (adminWallet.totalReceived >= adminWallet.totalCommissionsPaid) {
      adminWallet.netProfit := adminWallet.totalReceived - adminWallet.totalCommissionsPaid;
    } else {
      adminWallet.netProfit := 0;
    };

    records.toArray();
  };
};
