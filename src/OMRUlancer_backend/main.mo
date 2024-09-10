import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import UserTypes "types/userTypes";
import BountyTypes "types/bountyTypes";
import UtilityFunctions "utils/UtilityFunctions";
import Constants "utils/constants";
import Icrc "utils/icrc";

actor {

  let icpLedger = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  let ckbtcLedger = "mxzaz-hqaaa-aaaar-qaada-cai";
  let ckethLedger = "ss2fx-dyaaa-aaaar-qacoq-cai";
  let self="a4tbr-q4aaa-aaaaa-qaafq-cai";

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

    public query func getBidDetails(_bidID:Text):async Result.Result<BountyTypes.Bid,Text>{
      try{
        switch(bidRecords.get(_bidID)){
          case(null){
            #err(Constants.NO_BID_FOUND);
          };
          case(?bid){
            return #ok(bid);
          }
        }
      }catch e{
        return #err(Error.message(e));
      }
    };

    // Request to place a bid for getting the bounty by freelancer
    // Pending : linking bids to freelancer
    public shared ({caller}) func placeBidOnBounty(_bountyID:Text,_bidMessage:Text,_resume:Text):async Result.Result<Text,Text>{
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
                  isApproved=false;
                  isRejected=false;
                  resume=_resume;
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
    };

    public shared ({caller}) func assignBounty(_bidID:Text):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(bidRecords.get(_bidID)){
          case(null){
            return #err("No bid with this ID");
          };
          case(?bid){
            if(bid.isApproved){
              return #err("Already approved this bounty");
            };
            switch(bountyRecords.get(bid.bountyID)){
              case(null){
                return #err("No job exists for this bounty");
              };
              case(?bounty){
                if(caller != bounty.providerID){
                  return #err("You are not the provider for this job");
                };
                switch(userRecords.get(bounty.providerID)){
                  case(null){
                    return #err("this bounty has no provider");
                  };
                  case(?provider){
                    switch(userRecords.get(bid.freelancerID)){
                      case(null){
                        return #err("freelancer is not a valid user");
                      };
                      case(?freelancer){
                        var transactionResponse:Icrc.Result_2=#Ok(2);
                        switch(bounty.currency){
                          case(#icp){
                            transactionResponse:=await icrc2_transferFrom(icpLedger, caller, Principal.fromText(self), bounty.reward);
                          };
                          case(#ckbtc){
                            transactionResponse:=await icrc2_transferFrom(ckbtcLedger, caller, Principal.fromText(self), bounty.reward);
                          };
                          case(#cketh){
                            transactionResponse:=await icrc2_transferFrom(ckethLedger, caller, Principal.fromText(self), bounty.reward);
                          };
                        };
                        switch(transactionResponse){
                          case(#Ok(val)){
                            Debug.print(debug_show (val));
                          };
                          case(#Err(err)){
                            return #err("Some error occured while transaction using");
                          };
                        };
                        let newBounty:BountyTypes.Bounty={
                          id=bounty.id;
                          title=bounty.title;
                          description=bounty.description;
                          tags=bounty.tags;
                          isResolved=bounty.isResolved;
                          providerID=bounty.providerID;
                          reward=bounty.reward;
                          currency=bounty.currency;
                          bids=bounty.bids;
                          assignedTo=?bid.freelancerID;
                        };
                        let newBid:BountyTypes.Bid={
                          id=bid.id;
                          freelancerID=bid.freelancerID;
                          bountyID=bid.bountyID;
                          message=bid.message;
                          isApproved=true;
                          isRejected=false;
                          resume=bid.resume;
                        };
                        ignore bidRecords.replace(_bidID,newBid);
                        ignore bountyRecords.replace(bid.bountyID,newBounty);
                        return #ok("You have approved this application !");
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }catch e{
        return #err(Error.message(e));
      }
    };

    public shared({caller}) func resolveBounty(_bountyID:Text):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(bountyRecords.get(_bountyID)){
          case(null){
            return #err(Constants.NO_BOUNTY_FOUND);
          };
          case(?bounty){
            if(bounty.isResolved){
              return #err("This bounty is already resolved");
            };
            if(caller!=bounty.providerID){
              return #err(Constants.NOT_OWNER);
            };
            switch(bounty.assignedTo) {
              case(null) { return #err("Bounty not assigned to any freelancer") };
              case(?freelancer) {
                var transactionResponse:Icrc.Result=#Ok(2);
                switch(bounty.currency){
                  case(#icp){
                    transactionResponse:=await icrc1_transfer(icpLedger,freelancer,bounty.reward);
                  };
                  case(#ckbtc){
                    transactionResponse:=await icrc1_transfer(ckbtcLedger,freelancer,bounty.reward);
                  };
                  case(#cketh){
                    transactionResponse:=await icrc1_transfer(ckethLedger,freelancer,bounty.reward);
                  };
                };
                switch(transactionResponse){
                  case(#Ok(val)){
                    Debug.print(debug_show (val));
                  };
                  case(#Err(err)){
                    return #err("Some error occured while transaction using");
                  };
                };
                let newBounty:BountyTypes.Bounty={
                  id=bounty.id;
                  title=bounty.title;
                  description=bounty.description;
                  tags=bounty.tags;
                  isResolved=true;
                  providerID=bounty.providerID;
                  reward=bounty.reward;
                  currency=bounty.currency;
                  bids=bounty.bids;
                  assignedTo=bounty.assignedTo;
                };
                ignore bountyRecords.replace(_bountyID,newBounty);
                return #ok("Your bounty is marked as resolved");
              };
            };
          }
        }
      }catch e{
        return #err(Error.message(e));
      }
    };

    public shared({caller}) func rejectBid(_bidID:Text):async Result.Result<Text,Text>{
      try{
        await UtilityFunctions.checkAnonymous(caller);
        switch(bidRecords.get(_bidID)){
          case(null){
            return #err(Constants.NO_BID_FOUND);
          };
          case(?bid){
            switch(bountyRecords.get(bid.bountyID)){
              case(null){
                return #err(Constants.NO_BOUNTY_FOUND);
              };
              case(?bounty){
                if(caller!=bounty.providerID){
                  return #err(Constants.NOT_OWNER);
                };
                let newBid:BountyTypes.Bid={
                  id=bid.id;
                  freelancerID=bid.freelancerID;
                  bountyID=bid.bountyID;
                  message=bid.message;
                  isApproved=false;
                  isRejected=true; 
                  resume=bid.resume;
                };
                ignore bidRecords.replace(_bidID,newBid);
                return #ok("You have rejected this bid");
              }
            }
          }
        }
      }catch e{
        return #err(Error.message(e));
      }
    };

    public func getAllJobs(pageSize:Nat,pageNo:Nat):async Result.Result<[(Text,BountyTypes.Bounty)],Text>{
      try{
            if(pageNo < 1){
                return #err("Page number starts from 1");
            };
            let bountyIter=bountyRecords.entries();
            let bountyArr=Iter.toArray(bountyIter);
            var startIndex:Int=0;
            if(pageNo > 1){
                startIndex:=(pageNo - 1)*10;
            };
            var endIndex=startIndex+pageSize;
            if(startIndex >= bountyArr.size()){
                return #err("page number exceeds the number of entries");
            };
            if(endIndex > bountyArr.size()){
                endIndex := bountyArr.size();
            };
            let filteredJobListings=Iter.toArray(Array.slice(bountyArr,Int.abs(startIndex),Int.abs(endIndex)));
            return #ok(filteredJobListings)
      }catch e{
        return #err(Error.message(e));
      }
    };


    //for icrc2 payment
    func icrc2_transferFrom(ledgerId : Text, transferfrom : Principal, transferto : Principal, amount : Nat) : async Icrc.Result_2 {

        let ledger = actor (ledgerId) : Icrc.Token;
        await ledger.icrc2_transfer_from({
            spender_subaccount = null;
            from = {owner = transferfrom; subaccount = null};
            to = {owner = transferto; subaccount = null};
            amount;
            fee = null;
            memo = null;
            created_at_time = null;
        });

    };

    func icrc1_transfer(ledgerId : Text,transferto : Principal, amount:Nat):async Icrc.Result{

      let ledger = actor (ledgerId) : Icrc.Token;
      await ledger.icrc1_transfer({
        to = {owner=transferto; subaccount=null};
        fee = null;
        memo = null;
        from_subaccount = null;
        created_at_time = null;
        amount = amount;
      })
    };
}