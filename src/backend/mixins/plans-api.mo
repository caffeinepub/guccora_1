import Map "mo:core/Map";
import List "mo:core/List";
import UserTypes "../types/users";
import PlanTypes "../types/plans";

mixin (
  users : Map.Map<UserTypes.UserId, UserTypes.User>,
  products : List.List<PlanTypes.Product>,
  nextProductId : Nat,
) {
  func isPlansAdmin(adminId : Text, password : Text) : Bool {
    adminId == "6305462887" and password == "guccora@8433";
  };

  /// Return all active products (public)
  public query func getProducts() : async [PlanTypes.ProductPublic] {
    products
      .filter(func(p : PlanTypes.Product) : Bool { p.isActive })
      .map<PlanTypes.Product, PlanTypes.ProductPublic>(func(p : PlanTypes.Product) : PlanTypes.ProductPublic {
        { id = p.id; name = p.name; price = p.price; imageUrl = p.imageUrl; isActive = p.isActive };
      })
      .toArray();
  };

  /// Return all plans as legacy plan format (for backward compat)
  public query func getPlans() : async [PlanTypes.Plan] {
    products
      .filter(func(p : PlanTypes.Product) : Bool { p.isActive })
      .map<PlanTypes.Product, PlanTypes.Plan>(func(p : PlanTypes.Product) : PlanTypes.Plan {
        { id = p.id; name = p.name; price = p.price };
      })
      .toArray();
  };

  /// Admin: return ALL products including inactive
  public shared func adminGetProducts(adminId : Text, password : Text) : async { #ok : [PlanTypes.ProductPublic]; #err : Text } {
    if (not isPlansAdmin(adminId, password)) return #err("Unauthorized");
    let result = products
      .map<PlanTypes.Product, PlanTypes.ProductPublic>(func(p : PlanTypes.Product) : PlanTypes.ProductPublic {
        { id = p.id; name = p.name; price = p.price; imageUrl = p.imageUrl; isActive = p.isActive };
      })
      .toArray();
    #ok(result);
  };

  /// Admin: add a new product
  public shared func adminAddProduct(
    adminId : Text,
    password : Text,
    name : Text,
    price : Nat,
    imageUrl : ?Text,
  ) : async { #ok : PlanTypes.ProductPublic; #err : Text } {
    if (not isPlansAdmin(adminId, password)) return #err("Unauthorized");
    if (name.size() == 0) return #err("Product name is required");
    if (price == 0) return #err("Price must be greater than 0");

    let id = products.size() + 1;
    let product : PlanTypes.Product = {
      id;
      var name;
      var price;
      var imageUrl;
      var isActive = true;
    };
    products.add(product);
    #ok({ id = product.id; name = product.name; price = product.price; imageUrl = product.imageUrl; isActive = product.isActive });
  };

  /// Admin: update an existing product
  public shared func adminUpdateProduct(
    adminId : Text,
    password : Text,
    id : Nat,
    name : Text,
    price : Nat,
    imageUrl : ?Text,
  ) : async { #ok : (); #err : Text } {
    if (not isPlansAdmin(adminId, password)) return #err("Unauthorized");
    let productOpt = products.find(func(p : PlanTypes.Product) : Bool { p.id == id });
    switch (productOpt) {
      case null { #err("Product not found") };
      case (?product) {
        if (name.size() > 0) product.name := name;
        if (price > 0) product.price := price;
        product.imageUrl := imageUrl;
        #ok(());
      };
    };
  };

  /// Admin: soft-delete a product (set isActive = false)
  public shared func adminDeleteProduct(adminId : Text, password : Text, id : Nat) : async { #ok : (); #err : Text } {
    if (not isPlansAdmin(adminId, password)) return #err("Unauthorized");
    let productOpt = products.find(func(p : PlanTypes.Product) : Bool { p.id == id });
    switch (productOpt) {
      case null { #err("Product not found") };
      case (?product) {
        product.isActive := false;
        #ok(());
      };
    };
  };
};
