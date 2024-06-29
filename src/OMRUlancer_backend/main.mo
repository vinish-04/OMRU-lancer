import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import UserTypes "types/userTypes";
import BountyTypes "types/bountyTypes";
import UtilityFunctions "utils/UtilityFunctions";
import Constants "utils/constants";

actor {
  var userRecords=TrieMap.TrieMap<Principal,UserTypes.Users>(Principal.equal,Principal.hash);
  stable var stableUserRecords:[(Principal,UserTypes.Users)]=[];

  var bountyRecords=TrieMap.TrieMap<Text,BountyTypes.Bounty>(Text.equal,Text.hash);
  stable var stableBountyRecords:[(Text,BountyTypes.Bounty)]=[];
  
  var bidRecords=TrieMap.TrieMap<Text,BountyTypes.Bid>(Text.equal,Text.hash);
  stable var stableBidRecords:[(Text,BountyTypes.Bid)]=[];

   system func preupgrade(){
        stableUserRecords := Iter.toArray(userRecords.entries());
        stableBountyRecords := Iter.toArray(bountyRecords.entries());
        stableBidRecords := Iter.toArray(bidRecords.entries());
    };
    system func postupgrade(){
        let userRecordVals = stableUserRecords.vals();
        let bountyRecordVals = stableBountyRecords.vals();
        let bidRecordVals = stableBidRecords.vals();

        userRecords := TrieMap.fromEntries<Principal,UserTypes.Users>(userRecordVals,Principal.equal,Principal.hash);
        bountyRecords := TrieMap.fromEntries<Text,BountyTypes.Bounty>(bountyRecordVals,Text.equal,Text.hash);
        bidRecords := TrieMap.fromEntries<Text,BountyTypes.Bid>(bidRecordVals,Text.equal,Text.hash);

        stableBountyRecords := [];
        stableUserRecords := []; 
        stableBidRecords := [];
    };

    //New user creation
    public shared ({caller}) func registerUser(_userData:UserTypes.UserCreationInput):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(userRecords.get(caller)){
          case(null){
            let newUser:UserTypes.Users={
              id=caller;
              username=_userData.username;
              email=_userData.email;
              img=_userData.img;
              listedBounties=[];
              userType=#freelancer;
              bids=[];
            };
            userRecords.put(caller,newUser);
            return #ok(Constants.USER_CREATED);
          };
          case(?user){
            return #err(Constants.USER_ALREADY_EXISTS);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    //get user details
    public query func getUserDetails(_userID:Principal):async Result.Result<UserTypes.Users,Text>{
      try{
        switch(userRecords.get(_userID)){
          case(null){
            return #err(Constants.USER_NOT_FOUND);
          };
          case(?user){
            return #ok(user);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    // get user details
    public  shared query ({caller})  func getCallerDetails():async Result.Result<UserTypes.Users,Text>{
      try{
        switch(userRecords.get(caller)){
          case(null){
            return #err(Constants.USER_NOT_FOUND);
          };
          case(?user){
            return #ok(user);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    // becoming a bounty provider
    public shared ({caller}) func becomeProvider():async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(userRecords.get(caller)){
          case(null){
            return #err(Constants.USER_NOT_FOUND);
          };
          case(?user){
            if(user.userType==#provider){
              return #err(Constants.ALREADY_A_PROVIDER);
            };
            let newUser:UserTypes.Users={
              id=caller;
              username=user.username;
              email=user.email;
              img=user.img;
              listedBounties=user.listedBounties;
              userType=#provider;
              bids=user.bids;
            };
            ignore userRecords.replace(caller,newUser);
            return #ok(Constants.USER_TO_PROVIDER);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    // creating new bounty
    public shared ({caller}) func createBounty(_bountyData:BountyTypes.BountyInput):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(userRecords.get(caller)){
          case(null){
            return #err(Constants.USER_NOT_FOUND);
          };
          case(?user){
            if(user.userType!=#provider){
              return #err(Constants.NOT_A_PROVIDER);
            };
            let bountyID=Principal.toText(caller) # "#" # Nat.toText(user.listedBounties.size());
            var newListedBounties:Buffer.Buffer<Text> = Buffer.fromArray(user.listedBounties);
            newListedBounties.add(bountyID);
            let newUser:UserTypes.Users={
              id=caller;
              username=user.username;
              email=user.email;
              img=user.img;
              listedBounties=Buffer.toArray(newListedBounties);
              userType=user.userType;
              bids=user.bids;
            };
            let newBounty:BountyTypes.Bounty={
              id=bountyID;
              title=_bountyData.title;
              description=_bountyData.description;
              tags=_bountyData.tags;
              reward=_bountyData.reward;
              currency=_bountyData.currency;
              isResolved=false;
              providerID=caller;
              assignedTo=null;
              bids=[];
            };
            ignore userRecords.replace(caller,newUser);
            bountyRecords.put(bountyID,newBounty);
            return #ok(Constants.BOUNTY_CREATED);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    // Getting details of a bounty
    public query func getBountyDetails(_bountyID:Text):async Result.Result<BountyTypes.Bounty,Text>{
      try{
        switch(bountyRecords.get(_bountyID)){
          case(null){
            #err(Constants.NO_BOUNTY_FOUND);
          };
          case(?bounty){
            #ok(bounty);
          }
        }
      }catch e {
        return #err(Error.message(e));
      }
    };

    // Request to place a bid for getting the bounty by freelancer
    // Pending : linking bids to freelancer
    public shared ({caller}) func placeBidOnBounty(_bountyID:Text,_bidMessage:Text):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);

        switch(userRecords.get(caller)){
          case(null){
            return #err(Constants.USER_NOT_FOUND);
          };
          case(?user){
            switch(bountyRecords.get(_bountyID)){
              case(null){
                return #err(Constants.NO_BOUNTY_FOUND);
              };
              case(?bounty){
                if(bounty.providerID == caller){
                  return #err(Constants.PROVIDER_SAME_AS_FREELANCER);
                };
                if(bounty.isResolved){
                  return #err(Constants.BOUNTY_ALREADY_RESOLVED);
                };
                let bidID=_bountyID # "#" # "bidno=" # Nat.toText(bounty.bids.size());
                var newBids:Buffer.Buffer<Text> = Buffer.fromArray(bounty.bids);
                newBids.add(bidID);
                let newBounty:BountyTypes.Bounty={
                  id=bounty.id;
                  title=bounty.title;
                  description=bounty.description;
                  tags=bounty.tags;
                  reward=bounty.reward;
                  currency=bounty.currency;
                  isResolved=bounty.isResolved;
                  providerID=bounty.providerID;
                  assignedTo=bounty.assignedTo;
                  bids=Buffer.toArray(newBids);
                };
                let newBid:BountyTypes.Bid={
                  id=bidID;
                  bountyID=_bountyID;
                  freelancerID=caller;
                  message=_bidMessage;
                };
                var newUserBids:Buffer.Buffer<Text> = Buffer.fromArray(user.bids);
                newUserBids.add(bidID);
                let newUser:UserTypes.Users={
                  id=user.id;
                  username=user.username;
                  img=user.img;
                  listedBounties=user.listedBounties;
                  userType=user.userType;
                  email=user.email;
                  bids=Buffer.toArray(newUserBids);
                };
                ignore userRecords.replace(caller,newUser);
                ignore bountyRecords.replace(_bountyID,newBounty);
                bidRecords.put(bidID,newBid);
                return #ok(Constants.BID_PLACED);
              }
            }
          }
        }
      }catch e{
        return #err(Error.message(e));
      }
    }
};
