import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import UserTypes "../types/users";
import OrderTypes "../types/orders";
import UserLib "users";

module {
  public type User = UserTypes.User;
  public type UserId = UserTypes.UserId;
  public type Order = OrderTypes.Order;
  public type CommissionRecord = OrderTypes.CommissionRecord;
  public type AdminWallet = OrderTypes.AdminWallet;

  // Per-plan commission rates keyed by planPrice.
  // Returns (directIncome, levelPerLevel, pairIncome).
  func planRates(planPrice : Nat) : (Nat, Nat, Nat) {
    if (planPrice <= 599)       { (40,  5,  3) }
    else if (planPrice <= 999)  { (70,  8,  5) }
    else if (planPrice <= 1999) { (140, 16, 10) }
    else                        { (210, 24, 15) }
  };

  public let LEVEL_DEPTH : Nat = 10;

  /// Distribute all commissions for a newly approved order.
  /// Returns array of CommissionRecords generated (also stored in commissions List by caller).
  ///
  /// Rules:
  ///   - Buyer's wallet is NEVER touched.
  ///   - Direct income goes to the immediate sponsor (skip if #hold or #inactive).
  ///   - Level income walks up the sponsor chain for exactly LEVEL_DEPTH levels:
  ///       skip (move to next level) if upline is #hold; stop entirely if #inactive.
  ///   - Pair income is awarded to any upline sponsor (walking the chain) whose
  ///       left+right children have both purchased. The user's own pairPaid Set
  ///       (keyed by "leftId:rightId") prevents duplicate awards across orders.
  ///   - totalIncome and walletBalance are recalculated atomically in creditWallet.
  public func distributeCommissions(
    order : Order,
    users : Map.Map<UserId, User>,
    adminWallet : AdminWallet,
    purchasedSet : List.List<UserId>,
    nextCommissionId : Nat,
  ) : [CommissionRecord] {
    let records = List.empty<CommissionRecord>();
    var commId = nextCommissionId;
    let now = Time.now();
    let buyerId = order.buyer;

    // Determine per-plan rates
    let (directAmt, levelAmt, pairAmt) = planRates(order.planPrice);

    // ------------------------------------------------------------------
    // Step 1: Direct income to the immediate sponsor
    // ------------------------------------------------------------------
    switch (users.get(buyerId)) {
      case null {};
      case (?buyer) {
        switch (buyer.sponsorId) {
          case null {};
          case (?sponsorId) {
            switch (users.get(sponsorId)) {
              case null {};
              case (?sponsor) {
                if (sponsor.status == #active) {
                  let credited = UserLib.creditWallet(sponsor, directAmt, #direct);
                  if (credited) {
                    adminWallet.totalCommissionsPaid += directAmt;
                    records.add({
                      id = commId;
                      orderId = order.id;
                      recipient = sponsorId;
                      amount = directAmt;
                      commType = #direct;
                      level = 0;
                      timestamp = now;
                    });
                    commId += 1;
                  };
                };
              };
            };
          };
        };
      };
    };

    // ------------------------------------------------------------------
    // Step 2: Level income — walk up from direct sponsor, 10 levels
    // Level 1 = buyer's direct sponsor (same user who received direct income)
    // ------------------------------------------------------------------
    switch (users.get(buyerId)) {
      case null {};
      case (?buyer) {
        // Level chain starts from the buyer's direct sponsor (level 1)
        var current : ?UserId = buyer.sponsorId;
        var level = 1;
        label levelLoop while (level <= LEVEL_DEPTH) {
          switch (current) {
            case null break levelLoop;
            case (?uplineId) {
              switch (users.get(uplineId)) {
                case null { break levelLoop };
                case (?upline) {
                  if (upline.status == #inactive) {
                    // Stop distribution entirely on inactive
                    break levelLoop;
                  };
                  if (upline.status == #hold) {
                    // Skip this level but continue up the chain
                    current := upline.sponsorId;
                    level += 1;
                  } else {
                    // #active — credit level income
                    let lvlCredited = UserLib.creditWallet(upline, levelAmt, #level);
                    if (lvlCredited) {
                      adminWallet.totalCommissionsPaid += levelAmt;
                      records.add({
                        id = commId;
                        orderId = order.id;
                        recipient = uplineId;
                        amount = levelAmt;
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

    // ------------------------------------------------------------------
    // Step 3: Pair income — walk up the full sponsor chain
    // Award any upline who now has both left+right children purchased.
    // Use each upline's persistent pairPaid Set to prevent double-payment.
    // ------------------------------------------------------------------
    switch (users.get(buyerId)) {
      case null {};
      case (?buyer) {
        var chainUser : ?UserId = buyer.sponsorId;
        label pairLoop loop {
          switch (chainUser) {
            case null break pairLoop;
            case (?uid) {
              switch (users.get(uid)) {
                case null { break pairLoop };
                case (?u) {
                  if (u.status == #inactive) {
                    // Stop climbing on inactive
                    break pairLoop;
                  };
                  if (u.status == #active) {
                    // Check if this user qualifies for pair income
                    switch (u.leftChild, u.rightChild) {
                      case (?lid, ?rid) {
                        let key = UserLib.pairKey(lid, rid);
                        let alreadyPaid = u.pairPaid.contains(key);
                        if (not alreadyPaid) {
                          let leftBought = purchasedSet.find(func(id : UserId) : Bool { id == lid }) != null;
                          let rightBought = purchasedSet.find(func(id : UserId) : Bool { id == rid }) != null;
                          if (leftBought and rightBought) {
                            let pairCredited = UserLib.creditWallet(u, pairAmt, #pair);
                            if (pairCredited) {
                              // Mark this pairing as paid — persists across future orders
                              u.pairPaid.add(key);
                              adminWallet.totalCommissionsPaid += pairAmt;
                              records.add({
                                id = commId;
                                orderId = order.id;
                                recipient = uid;
                                amount = pairAmt;
                                commType = #pair;
                                level = 0;
                                timestamp = now;
                              });
                              commId += 1;
                            };
                          };
                        };
                      };
                      case _ {};
                    };
                  };
                  // Continue up the chain regardless of hold/active
                  chainUser := u.sponsorId;
                };
              };
            };
          };
        };
      };
    };

    // Update admin net profit
    if (adminWallet.totalReceived >= adminWallet.totalCommissionsPaid) {
      adminWallet.netProfit := adminWallet.totalReceived - adminWallet.totalCommissionsPaid;
    } else {
      adminWallet.netProfit := 0;
    };

    records.toArray();
  };
};
