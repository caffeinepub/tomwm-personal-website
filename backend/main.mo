import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  // Data Types
  type PageContent = {
    title : Text;
    subtitle : Text;
    content : Text;
  };

  type Essay = {
    id : Nat;
    title : Text;
    excerpt : Text;
    tags : [Text];
    publicationDate : Int;
    isFeatured : Bool;
  };

  module Essay {
    public func compare(essay1 : Essay, essay2 : Essay) : Order.Order {
      if (essay1.publicationDate > essay2.publicationDate) {
        #less;
      } else if (essay1.publicationDate < essay2.publicationDate) {
        #greater;
      } else {
        Text.compare(essay1.title, essay2.title);
      };
    };
  };

  type ContactInfo = {
    email : Text;
    linkedIn : Text;
    bluesky : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Persistent State
  var nextEssayId = 1;
  let pageContents = Map.empty<Text, PageContent>();
  let essays = Map.empty<Nat, Essay>();
  var contactInfo : ?ContactInfo = null;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access Control State
  let accessControlState = AccessControl.initState();

  // Site Owner Principal Storage
  // This stores the principal of the site owner (Tom's Internet Identity)
  // The first authenticated user to call initializeAccessControl becomes the permanent site owner
  var siteOwnerPrincipal : ?Principal = null;

  // Helper Functions

  // Ensures the site owner (Tom's logged-in identity) always has admin privileges
  // This function checks if the caller is the designated site owner and grants/maintains admin status
  func ensureSiteOwnerHasAdminRole(caller : Principal) {
    switch (siteOwnerPrincipal) {
      case (null) {
        // No site owner set yet - this shouldn't happen if initializeAccessControl was called
        // But we handle it gracefully by not granting admin to unknown callers
      };
      case (?owner) {
        // Only grant admin role if the caller is the site owner
        if (Principal.equal(caller, owner)) {
          let currentRole = AccessControl.getUserRole(accessControlState, caller);
          // Re-establish admin status if needed (e.g., after reconnection)
          if (currentRole != #admin) {
            // Use the site owner's own principal to assign the role
            // This ensures the site owner can always manage their own admin status
            AccessControl.assignRole(accessControlState, owner, owner, #admin);
          };
        };
      };
    };
  };

  // Initialize user in the access control system and ensure site owner has admin privileges
  func ensureUserInitialized(caller : Principal) {
    // Initialize the user if they haven't been initialized yet
    AccessControl.initialize(accessControlState, caller);
    // Ensure site owner maintains admin privileges
    ensureSiteOwnerHasAdminRole(caller);
  };

  // Check if caller has admin permissions (for admin-only operations)
  func requireAdminPermission(caller : Principal) {
    ensureUserInitialized(caller);
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Page Content Management
  public shared ({ caller }) func updatePageContent(page : Text, content : PageContent) : async () {
    requireAdminPermission(caller);
    pageContents.add(page, content);
  };

  // Essay Management
  public shared ({ caller }) func addEssay(title : Text, excerpt : Text, tags : [Text], publicationDate : Int) : async Nat {
    requireAdminPermission(caller);
    let essay : Essay = {
      id = nextEssayId;
      title;
      excerpt;
      tags;
      publicationDate;
      isFeatured = false;
    };
    essays.add(nextEssayId, essay);
    nextEssayId += 1;
    essay.id;
  };

  public shared ({ caller }) func updateEssay(id : Nat, title : Text, excerpt : Text, tags : [Text], publicationDate : Int) : async () {
    requireAdminPermission(caller);
    switch (essays.get(id)) {
      case (null) {
        Runtime.trap("Essay not found");
      };
      case (?existingEssay) {
        let updatedEssay : Essay = {
          id;
          title;
          excerpt;
          tags;
          publicationDate;
          isFeatured = existingEssay.isFeatured;
        };
        essays.add(id, updatedEssay);
      };
    };
  };

  public shared ({ caller }) func deleteEssay(id : Nat) : async () {
    requireAdminPermission(caller);
    if (not essays.containsKey(id)) {
      Runtime.trap("Essay not found");
    };
    essays.remove(id);
  };

  public shared ({ caller }) func setFeaturedEssay(id : Nat) : async () {
    requireAdminPermission(caller);

    if (not essays.containsKey(id)) {
      Runtime.trap("Essay not found");
    };

    let allEssays = essays.values().toArray();
    allEssays.forEach(
      func(v) {
        let updatedEssay = {
          id = v.id;
          title = v.title;
          excerpt = v.excerpt;
          tags = v.tags;
          publicationDate = v.publicationDate;
          isFeatured = false;
        };
        essays.add(v.id, updatedEssay);
      }
    );

    switch (essays.get(id)) {
      case (null) {};
      case (?essay) {
        let featuredEssay = {
          id = essay.id;
          title = essay.title;
          excerpt = essay.excerpt;
          tags = essay.tags;
          publicationDate = essay.publicationDate;
          isFeatured = true;
        };
        essays.add(id, featuredEssay);
      };
    };
  };

  // Contact Info Management
  public shared ({ caller }) func updateContactInfo(email : Text, linkedIn : Text, bluesky : Text) : async () {
    requireAdminPermission(caller);
    contactInfo := ?{
      email;
      linkedIn;
      bluesky;
    };
  };

  // Query Functions
  public query func getPageContent(page : Text) : async PageContent {
    switch (pageContents.get(page)) {
      case (null) {
        Runtime.trap("Page not found");
      };
      case (?content) { content };
    };
  };

  public query func getAllEssays() : async [Essay] {
    essays.values().toArray().sort();
  };

  public query func getFeaturedEssay() : async ?Essay {
    let allEssays = essays.values().toArray();
    switch (allEssays.find(func(essay) { essay.isFeatured })) {
      case (null) { null };
      case (?essay) { ?essay };
    };
  };

  public query func getContactInfo() : async ContactInfo {
    switch (contactInfo) {
      case (null) {
        Runtime.trap("Contact info not found");
      };
      case (?info) { info };
    };
  };

  public query func getSiteBranding() : async Text {
    "tomwm";
  };

  // Access Control Functions

  // Initialize access control and designate the site owner
  // The first authenticated user to call this becomes the permanent site owner with admin privileges
  // This ensures Tom's logged-in Internet Identity always has admin access to manage all site content
  public shared ({ caller }) func initializeAccessControl() : async () {
    // Set the site owner if not already set (first authenticated caller becomes owner)
    switch (siteOwnerPrincipal) {
      case (null) {
        // First time initialization - designate this caller as the site owner
        siteOwnerPrincipal := ?caller;
        // Initialize the access control system (first caller becomes admin)
        AccessControl.initialize(accessControlState, caller);
      };
      case (?owner) {
        // Site owner already exists
        if (Principal.equal(caller, owner)) {
          // Same principal reconnecting - re-establish admin status if needed
          ensureSiteOwnerHasAdminRole(caller);
        } else {
          // Different principal - initialize as regular user
          AccessControl.initialize(accessControlState, caller);
        };
      };
    };
  };

  public shared ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    ensureUserInitialized(caller);
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    ensureUserInitialized(caller);
    // AccessControl.assignRole includes admin-only guard internally
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public shared ({ caller }) func isCallerAdmin() : async Bool {
    ensureUserInitialized(caller);
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management
  public shared ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    ensureUserInitialized(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    ensureUserInitialized(caller);

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserInitialized(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
