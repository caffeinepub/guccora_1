import Map "mo:core/Map";
import List "mo:core/List";
import UserTypes "../types/users";
import NotifTypes "../types/notifications";
import UserLib "../lib/users";
import Runtime "mo:core/Runtime";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  referralIndex : Map.Map<Text, UserTypes.UserId>,
  mobileIndex : Map.Map<Text, UserTypes.UserId>,
  notifications : List.List<NotifTypes.Notification>,
  nextNotificationId : Nat,
) {
  /// Register a new user with mobile number, password, name, and optional sponsor referral code.
  /// Fully public — no authentication required.
  public shared func registerUser(
    name : Text,
    mobileNumber : Text,
    password : Text,
    sponsorCode : ?Text,
    position : ?Text,
  ) : async { #ok : UserTypes.UserPublic; #err : Text } {
    if (name.size() == 0) return #err("Name is required");
    if (mobileNumber.size() == 0) return #err("Mobile number is required");
    if (password.size() == 0) return #err("Password is required");
    // Mobile number is the userId — check uniqueness
    if (users.containsKey(mobileNumber)) return #err("Mobile number already registered");

    let baseCode = UserLib.generateReferralCode(mobileNumber);
    var referralCode = baseCode;
    var suffix = 0;
    while (referralIndex.containsKey(referralCode)) {
      suffix += 1;
      referralCode := baseCode # suffix.toText();
    };

    // Resolve sponsor
    var sponsorId : ?UserTypes.UserId = null;
    switch (sponsorCode) {
      case null {};
      case (?code) {
        if (code.size() > 0) {
          switch (referralIndex.get(code)) {
            case null { return #err("Invalid referral code") };
            case (?sid) { sponsorId := ?sid };
          };
        };
      };
    };

    // Determine position ("left" or "right"; default "left")
    let pos = switch (position) {
      case (?p) { if (p == "right") "right" else "left" };
      case null "left";
    };

    // First user becomes admin (no Principal dependency)
    let isAdmin = users.size() == 0;

    let user = UserLib.newUser(mobileNumber, name, referralCode, mobileNumber, password, sponsorId, isAdmin, pos);
    users.add(mobileNumber, user);
    referralIndex.add(referralCode, mobileNumber);
    mobileIndex.add(mobileNumber, mobileNumber);

    // Place in sponsor's binary tree using preferred position
    switch (sponsorId) {
      case null {};
      case (?sid) {
        UserLib.placeChildWithPosition(sid, mobileNumber, pos, users);
      };
    };

    #ok(UserLib.toPublic(user));
  };

  /// Login using mobile number and password.
  /// Fully public — no authentication required.
  public shared func loginUser(mobileNumber : Text, password : Text) : async { #ok : { userId : UserTypes.UserId; profile : UserTypes.UserPublic }; #err : Text } {
    switch (users.get(mobileNumber)) {
      case null { #err("Invalid mobile or password") };
      case (?user) {
        if (user.passwordHash != password) return #err("Invalid mobile or password");
        if (user.status == #inactive) return #err("Account is inactive. Contact admin.");
        #ok({ userId = mobileNumber; profile = UserLib.toPublic(user) });
      };
    };
  };

  /// Get a user by mobile number (public lookup)
  public query func getUserByMobile(mobileNumber : Text) : async ?UserTypes.UserPublic {
    switch (users.get(mobileNumber)) {
      case null null;
      case (?user) ?UserLib.toPublic(user);
    };
  };

  /// Get profile by userId (mobile number). Pass the userId received at login.
  public query func getMyProfile(userId : UserTypes.UserId) : async { #ok : UserTypes.UserPublic; #err : Text } {
    switch (users.get(userId)) {
      case null #err("User not found");
      case (?u) #ok(UserLib.toPublic(u));
    };
  };

  /// Get wallet info by userId (mobile number)
  public query func getMyWallet(userId : UserTypes.UserId) : async { #ok : UserTypes.WalletInfo; #err : Text } {
    switch (users.get(userId)) {
      case null #err("User not found");
      case (?u) #ok(UserLib.getWalletInfo(u));
    };
  };

  /// Get referral code by userId (mobile number)
  public query func getMyReferralCode(userId : UserTypes.UserId) : async Text {
    switch (users.get(userId)) {
      case null Runtime.trap("User not found");
      case (?u) u.referralCode;
    };
  };

  /// Get the downline binary tree for a userId (mobile number)
  public query func getDownlineTree(userId : UserTypes.UserId) : async { #ok : UserTypes.TreeNode; #err : Text } {
    if (not users.containsKey(userId)) return #err("User not found");
    #ok(UserLib.buildTree(users, userId));
  };

  /// Get direct downline (referral children) for a userId (mobile number)
  public query func getDirectDownline(userId : UserTypes.UserId) : async [UserTypes.UserPublic] {
    let downline = UserLib.getDirectDownline(users, userId);
    downline.map(func(u : UserTypes.User) : UserTypes.UserPublic { UserLib.toPublic(u) });
  };

  /// Save bank details and/or UPI ID for a userId (mobile number)
  public shared func savePaymentDetails(
    userId : UserTypes.UserId,
    bankDetails : ?UserTypes.BankDetails,
    upiId : ?Text,
  ) : async { #ok : (); #err : Text } {
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        user.bankDetails := bankDetails;
        user.upiId := upiId;
        #ok(());
      };
    };
  };

  /// Get payment details for a userId (mobile number)
  public query func getMyPaymentDetails(userId : UserTypes.UserId) : async { #ok : UserTypes.PaymentDetails; #err : Text } {
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        #ok({
          bankDetails = user.bankDetails;
          upiId = user.upiId;
        });
      };
    };
  };

  /// Get notifications for a userId — both broadcast and targeted
  public query func getMyNotifications(userId : UserTypes.UserId) : async [NotifTypes.NotificationPublic] {
    notifications
      .filter(func(n : NotifTypes.Notification) : Bool {
        switch (n.recipientId) {
          case null true; // broadcast
          case (?rid) rid == userId;
        };
      })
      .map<NotifTypes.Notification, NotifTypes.NotificationPublic>(
        func(n : NotifTypes.Notification) : NotifTypes.NotificationPublic {
          {
            id = n.id;
            recipientId = n.recipientId;
            message = n.message;
            timestamp = n.timestamp;
            isRead = n.isRead;
          };
        }
      )
      .sort<NotifTypes.NotificationPublic>(func(a, b) {
        // Sort newest first
        if (a.timestamp > b.timestamp) #less
        else if (a.timestamp < b.timestamp) #greater
        else #equal
      })
      .toArray();
  };

  /// Mark a notification as read for a userId
  public shared func markNotificationRead(userId : UserTypes.UserId, notificationId : Nat) : async { #ok : (); #err : Text } {
    var found = false;
    notifications.mapInPlace(func(n : NotifTypes.Notification) : NotifTypes.Notification {
      switch (n.recipientId) {
        case null {
          if (n.id == notificationId) {
            found := true;
            n.isRead := true;
          };
          n;
        };
        case (?rid) {
          if (n.id == notificationId and rid == userId) {
            found := true;
            n.isRead := true;
          };
          n;
        };
      };
    });
    if (found) #ok(()) else #err("Notification not found");
  };
};
