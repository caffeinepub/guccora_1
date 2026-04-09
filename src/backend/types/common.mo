module {
  public type UserId = Text; // Mobile number is the unique user identifier
  public type Timestamp = Int;
  public type Result<T, E> = { #ok : T; #err : E };
};
