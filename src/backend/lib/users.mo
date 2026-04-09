import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Types "../types/users";

module {
  public type User = Types.User;
  public type UserPublic = Types.UserPublic;
  public type UserId = Types.UserId;
  public type TreeNode = Types.TreeNode;
  public type BankDetails = Types.BankDetails;

  /// Generate a simple referral code from a mobile number (last 5 digits with prefix)
  public func generateReferralCode(mobile : UserId) : Text {
    let prefix = "GUC";
    // Take last 5 chars of mobile number as suffix
    let mSize = mobile.size();
    let suffix = if (mSize >= 5) {
      let arr = mobile.toArray();
      let startIdx : Int = mSize - 5;
      Text.fromArray(arr.sliceToArray(startIdx, mSize));
    } else {
      mobile;
    };
    prefix # suffix;
  };

  /// Create a new user record. userId = mobileNumber (unique Text key)
  public func newUser(
    id : UserId,
    name : Text,
    referralCode : Text,
    mobileNumber : Text,
    passwordHash : Text,
    sponsorId : ?UserId,
    isAdmin : Bool,
    position : Text,
  ) : User {
    {
      id;
      var name;
      referralCode;
      var mobileNumber;
      var passwordHash;
      var sponsorId;
      var position;
      var leftChild = null;
      var rightChild = null;
      var walletBalance = 0;
      var directIncome = 0;
      var levelIncome = 0;
      var pairIncome = 0;
      var totalIncome = 0;
      createdAt = Time.now();
      var isAdmin;
      var status = #active;
      var bankDetails = null;
      var upiId = null;
      var pairPaid = Set.empty<Text>();
    };
  };

  /// Convert internal mutable User to public immutable UserPublic
  public func toPublic(user : User) : UserPublic {
    {
      id = user.id;
      name = user.name;
      referralCode = user.referralCode;
      mobileNumber = user.mobileNumber;
      sponsorId = user.sponsorId;
      position = user.position;
      leftChild = user.leftChild;
      rightChild = user.rightChild;
      walletBalance = user.walletBalance;
      directIncome = user.directIncome;
      levelIncome = user.levelIncome;
      pairIncome = user.pairIncome;
      totalIncome = user.totalIncome;
      createdAt = user.createdAt;
      isAdmin = user.isAdmin;
      status = user.status;
      hasBankDetails = user.bankDetails != null;
      hasUpiId = user.upiId != null;
    };
  };

  /// Get wallet info for a user
  public func getWalletInfo(user : User) : Types.WalletInfo {
    {
      balance = user.walletBalance;
      directIncome = user.directIncome;
      levelIncome = user.levelIncome;
      pairIncome = user.pairIncome;
      totalIncome = user.totalIncome;
    };
  };

  /// Credit wallet balance for a user (commissions only — never buyer).
  /// Only credits if user status is #active (skip if #hold or #inactive).
  /// Updates the specific income field AND recalculates totalIncome and walletBalance atomically.
  public func creditWallet(user : User, amount : Nat, commType : { #direct; #level; #pair }) : Bool {
    switch (user.status) {
      case (#active) {
        switch (commType) {
          case (#direct) { user.directIncome += amount };
          case (#level)  { user.levelIncome += amount };
          case (#pair)   { user.pairIncome += amount };
        };
        // Recalculate totalIncome atomically
        user.totalIncome := user.directIncome + user.levelIncome + user.pairIncome;
        // walletBalance reflects all earned commissions
        user.walletBalance := user.totalIncome;
        true;
      };
      case (#hold) {
        // User on hold — skip commission
        false;
      };
      case (#inactive) {
        // Inactive user — skip commission
        false;
      };
    };
  };

  /// Check if a user has both left and right children with at least one purchase each.
  /// Uses purchasedSet (list of buyers who have at least one approved order).
  public func hasPairQualified(user : User, purchasedSet : List.List<UserId>) : Bool {
    switch (user.leftChild, user.rightChild) {
      case (?lid, ?rid) {
        purchasedSet.find(func(id : UserId) : Bool { id == lid }) != null
        and purchasedSet.find(func(id : UserId) : Bool { id == rid }) != null;
      };
      case _ false;
    };
  };

  /// Build the canonical pair key for a user's left+right children.
  /// Used to track which pairings have already been paid.
  public func pairKey(leftId : UserId, rightId : UserId) : Text {
    leftId # ":" # rightId;
  };

  /// Place a child into the binary tree using BFS (left slot first, then right)
  public func placeChild(rootId : UserId, childId : UserId, users : Map.Map<UserId, User>) {
    let queue = List.empty<UserId>();
    queue.add(rootId);
    var placed = false;
    label bfs while (not placed and queue.size() > 0) {
      let currentId = queue.at(0);
      // Pop front: rebuild queue without first element
      var skipFirst = true;
      let remaining = List.empty<UserId>();
      queue.forEach(func(uid : UserId) {
        if (skipFirst) { skipFirst := false }
        else { remaining.add(uid) };
      });
      queue.clear();
      queue.append(remaining);

      switch (users.get(currentId)) {
        case null {};
        case (?u) {
          if (u.leftChild == null) {
            u.leftChild := ?childId;
            placed := true;
          } else if (u.rightChild == null) {
            u.rightChild := ?childId;
            placed := true;
          } else {
            switch (u.leftChild) {
              case (?lid) queue.add(lid);
              case null {};
            };
            switch (u.rightChild) {
              case (?rid) queue.add(rid);
              case null {};
            };
          };
        };
      };
    };
  };

  /// Place a child into the binary tree respecting a preferred position ("left" or "right").
  /// Tries the preferred side of the direct sponsor first; if that slot is taken,
  /// falls back to BFS on the preferred side only before using the other side.
  public func placeChildWithPosition(sponsorId : UserId, childId : UserId, position : Text, users : Map.Map<UserId, User>) {
    switch (users.get(sponsorId)) {
      case null {};
      case (?sponsor) {
        let preferLeft = position != "right"; // default to left for anything other than "right"
        if (preferLeft) {
          if (sponsor.leftChild == null) {
            sponsor.leftChild := ?childId;
            return;
          } else if (sponsor.rightChild == null) {
            sponsor.rightChild := ?childId;
            return;
          };
        } else {
          if (sponsor.rightChild == null) {
            sponsor.rightChild := ?childId;
            return;
          } else if (sponsor.leftChild == null) {
            sponsor.leftChild := ?childId;
            return;
          };
        };
        // Both slots taken — BFS starting from the preferred side
        let queue = List.empty<UserId>();
        if (preferLeft) {
          switch (sponsor.leftChild) { case (?lid) queue.add(lid); case null {} };
          switch (sponsor.rightChild) { case (?rid) queue.add(rid); case null {} };
        } else {
          switch (sponsor.rightChild) { case (?rid) queue.add(rid); case null {} };
          switch (sponsor.leftChild) { case (?lid) queue.add(lid); case null {} };
        };
        var placed = false;
        label bfs while (not placed and queue.size() > 0) {
          let currentId = queue.at(0);
          var skipFirst = true;
          let remaining = List.empty<UserId>();
          queue.forEach(func(uid : UserId) {
            if (skipFirst) { skipFirst := false }
            else { remaining.add(uid) };
          });
          queue.clear();
          queue.append(remaining);
          switch (users.get(currentId)) {
            case null {};
            case (?u) {
              if (preferLeft) {
                if (u.leftChild == null) {
                  u.leftChild := ?childId;
                  placed := true;
                } else if (u.rightChild == null) {
                  u.rightChild := ?childId;
                  placed := true;
                } else {
                  switch (u.leftChild) { case (?lid) queue.add(lid); case null {} };
                  switch (u.rightChild) { case (?rid) queue.add(rid); case null {} };
                };
              } else {
                if (u.rightChild == null) {
                  u.rightChild := ?childId;
                  placed := true;
                } else if (u.leftChild == null) {
                  u.leftChild := ?childId;
                  placed := true;
                } else {
                  switch (u.rightChild) { case (?rid) queue.add(rid); case null {} };
                  switch (u.leftChild) { case (?lid) queue.add(lid); case null {} };
                };
              };
            };
          };
        };
      };
    };
  };

  /// Build the downline tree recursively
  public func buildTree(users : Map.Map<UserId, User>, rootId : UserId) : TreeNode {
    switch (users.get(rootId)) {
      case null { { user = rootId; name = "Unknown"; children = [] } };
      case (?u) {
        let childNodes = List.empty<TreeNode>();
        switch (u.leftChild) {
          case (?lid) { childNodes.add(buildTree(users, lid)) };
          case null {};
        };
        switch (u.rightChild) {
          case (?rid) { childNodes.add(buildTree(users, rid)) };
          case null {};
        };
        { user = rootId; name = u.name; children = childNodes.toArray() };
      };
    };
  };

  /// Get all direct downline (users whose sponsorId == sponsorId param)
  public func getDirectDownline(users : Map.Map<UserId, User>, sponsorId : UserId) : [User] {
    users.values()
      .filter(func(u : User) : Bool {
        switch (u.sponsorId) {
          case (?sid) sid == sponsorId;
          case null false;
        };
      })
      .toArray();
  };
};
