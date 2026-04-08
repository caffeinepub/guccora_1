module {
  public type Product = {
    id : Nat;
    var name : Text;
    var price : Nat;
    var imageUrl : ?Text;
    var isActive : Bool;
  };

  // Shared (immutable) version for public API
  public type ProductPublic = {
    id : Nat;
    name : Text;
    price : Nat;
    imageUrl : ?Text;
    isActive : Bool;
  };

  // Legacy alias for backward compatibility
  public type Plan = {
    id : Nat;
    name : Text;
    price : Nat;
  };
};
