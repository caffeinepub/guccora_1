import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import UserTypes "../types/users";
import NotifTypes "../types/notifications";
import UserLib "../lib/users";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  referralIndex : Map.Map<Text, UserTypes.UserId>,
  mobileIndex : Map.Map<Text, UserTypes.UserId>,
  notifications : List.List<NotifTypes.Notification>,
  nextNotificationId : Nat,
) {
  /// Register a new user with mobile number, password, name, and optional sponsor referral code.
  /// The caller principal is their identity.
  public shared ({ caller }) func registerUser(
    name : Text,
    mobileNumber : Text,
    password : Text,
    sponsorCode : ?Text,
  ) : async { #ok : UserTypes.UserPublic; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous caller not allowed");
    if (users.containsKey(caller)) return #err("Already registered");
    if (mobileNumber.size() == 0) return #err("Mobile number is required");
    if (password.size() == 0) return #err("Password is required");
    if (mobileIndex.containsKey(mobileNumber)) return #err("Mobile number already registered");

    let baseCode = UserLib.generateReferralCode(caller);
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
        switch (referralIndex.get(code)) {
          case null { return #err("Invalid referral code") };
          case (?sid) { sponsorId := ?sid };
        };
      };
    };

    // First user with no admin yet becomes admin
    let isAdmin = users.size() == 0;

    let user = UserLib.newUser(caller, name, referralCode, mobileNumber, password, sponsorId, isAdmin);
    users.add(caller, user);
    referralIndex.add(referralCode, caller);
    mobileIndex.add(mobileNumber, caller);

    // Place in sponsor's binary tree
    switch (sponsorId) {
      case null {};
      case (?sid) {
        UserLib.placeChild(sid, caller, users);
      };
    };

    #ok(UserLib.toPublic(user));
  };

  /// Login using mobile number and password.
  /// Returns the user principal and public profile on success.
  public shared func loginUser(mobileNumber : Text, password : Text) : async { #ok : { userId : UserTypes.UserId; profile : UserTypes.UserPublic }; #err : Text } {
    switch (mobileIndex.get(mobileNumber)) {
      case null { #err("Mobile number not registered") };
      case (?userId) {
        switch (users.get(userId)) {
          case null { #err("User not found") };
          case (?user) {
            if (user.passwordHash != password) return #err("Invalid password");
            if (user.status == #inactive) return #err("Account is inactive. Contact admin.");
            #ok({ userId; profile = UserLib.toPublic(user) });
          };
        };
      };
    };
  };

  /// Get a user by mobile number (for admin/lookup purposes)
  public shared query func getUserByMobile(mobileNumber : Text) : async ?UserTypes.UserPublic {
    switch (mobileIndex.get(mobileNumber)) {
      case null null;
      case (?userId) {
        switch (users.get(userId)) {
          case null null;
          case (?user) ?UserLib.toPublic(user);
        };
      };
    };
  };

  /// Get caller's own profile
  public shared query ({ caller }) func getMyProfile() : async { #ok : UserTypes.UserPublic; #err : Text } {
    switch (users.get(caller)) {
      case null #err("User not found");
      case (?u) #ok(UserLib.toPublic(u));
    };
  };

  /// Get caller's wallet info
  public shared query ({ caller }) func getMyWallet() : async { #ok : UserTypes.WalletInfo; #err : Text } {
    switch (users.get(caller)) {
      case null #err("User not found");
      case (?u) #ok(UserLib.getWalletInfo(u));
    };
  };

  /// Get caller's referral code
  public shared query ({ caller }) func getMyReferralCode() : async Text {
    switch (users.get(caller)) {
      case null Runtime.trap("User not found");
      case (?u) u.referralCode;
    };
  };

  /// Get the caller's downline binary tree
  public shared query ({ caller }) func getDownlineTree() : async { #ok : UserTypes.TreeNode; #err : Text } {
    if (not users.containsKey(caller)) return #err("User not found");
    #ok(UserLib.buildTree(users, caller));
  };

  /// Get the caller's direct downline (referral children)
  public shared query ({ caller }) func getDirectDownline() : async [UserTypes.UserPublic] {
    let downline = UserLib.getDirectDownline(users, caller);
    downline.map(func(u : UserTypes.User) : UserTypes.UserPublic { UserLib.toPublic(u) });
  };

  /// Save bank details and/or UPI ID for the caller
  public shared ({ caller }) func savePaymentDetails(
    bankDetails : ?UserTypes.BankDetails,
    upiId : ?Text,
  ) : async { #ok : (); #err : Text } {
    switch (users.get(caller)) {
      case null { #err("User not found") };
      case (?user) {
        user.bankDetails := bankDetails;
        user.upiId := upiId;
        #ok(());
      };
    };
  };

  /// Get the caller's payment details
  public shared query ({ caller }) func getMyPaymentDetails() : async { #ok : UserTypes.PaymentDetails; #err : Text } {
    switch (users.get(caller)) {
      case null { #err("User not found") };
      case (?user) {
        #ok({
          bankDetails = user.bankDetails;
          upiId = user.upiId;
        });
      };
    };
  };

  /// Get notifications for the caller — both broadcast and targeted
  public shared query ({ caller }) func getMyNotifications() : async [NotifTypes.NotificationPublic] {
    notifications
      .filter(func(n : NotifTypes.Notification) : Bool {
        switch (n.recipientId) {
          case null true; // broadcast
          case (?rid) Principal.equal(rid, caller);
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

  /// Mark a notification as read for the caller
  public shared ({ caller }) func markNotificationRead(notificationId : Nat) : async { #ok : (); #err : Text } {
    var found = false;
    notifications.mapInPlace(func(n : NotifTypes.Notification) : NotifTypes.Notification {
      switch (n.recipientId) {
        case null {
          // Broadcast — mark read only if targeted to caller by checking id
          if (n.id == notificationId) {
            found := true;
            n.isRead := true;
          };
          n;
        };
        case (?rid) {
          if (n.id == notificationId and Principal.equal(rid, caller)) {
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
