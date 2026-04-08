import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat8 "mo:core/Nat8";
import Types "../types/users";

module {
  public type User = Types.User;
  public type UserPublic = Types.UserPublic;
  public type UserId = Types.UserId;
  public type TreeNode = Types.TreeNode;
  public type BankDetails = Types.BankDetails;

  let hexChars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

  /// Generate a referral code from a principal — first 8 hex chars of blob
  public func generateReferralCode(id : UserId) : Text {
    let blob = id.toBlob();
    let bytes = blob.vals();
    var code = "";
    var count = 0;
    label hexLoop for (byte in bytes) {
      if (count >= 4) break hexLoop;
      let hi = (byte.toNat() / 16);
      let lo = (byte.toNat() % 16);
      code := code # hexChars[hi] # hexChars[lo];
      count += 1;
    };
    code;
  };

  /// Create a new user record
  public func newUser(
    id : UserId,
    name : Text,
    referralCode : Text,
    mobileNumber : Text,
    passwordHash : Text,
    sponsorId : ?UserId,
    isAdmin : Bool,
  ) : User {
    {
      id;
      var name;
      referralCode;
      var mobileNumber;
      var passwordHash;
      var sponsorId;
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

  /// Credit wallet balance for a user (commissions only — never buyer)
  /// Only credits if user status is #active (skip if #hold or #inactive)
  public func creditWallet(user : User, amount : Nat, commType : { #direct; #level; #pair }) : Bool {
    switch (user.status) {
      case (#active) {
        user.walletBalance += amount;
        user.totalIncome += amount;
        switch (commType) {
          case (#direct) { user.directIncome += amount };
          case (#level)  { user.levelIncome += amount };
          case (#pair)   { user.pairIncome += amount };
        };
        true;
      };
      case (#hold) {
        // User on hold — skip commission, return false (amount stays in admin wallet)
        false;
      };
      case (#inactive) {
        // Inactive user — skip commission, return false
        false;
      };
    };
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

  /// Check if a user has both left and right children with at least one purchase each
  public func hasPairQualified(user : User, purchasedSet : List.List<UserId>) : Bool {
    switch (user.leftChild, user.rightChild) {
      case (?lid, ?rid) {
        purchasedSet.find(func(id : UserId) : Bool { Principal.equal(id, lid) }) != null
        and purchasedSet.find(func(id : UserId) : Bool { Principal.equal(id, rid) }) != null;
      };
      case _ false;
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
          case (?sid) Principal.equal(sid, sponsorId);
          case null false;
        };
      })
      .toArray();
  };
};
