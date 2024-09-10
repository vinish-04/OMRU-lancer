import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
module{
    public type Currency={
        #icp;
        #ckbtc;
        #cketh;
    };
    public type Bounty={
        id:Text;
        title:Text;
        description:Text;
        tags:[Text];
        isResolved:Bool;
        providerID:Principal;
        assignedTo:?Principal;
        reward:Nat;
        currency:Currency;
        bids:[Text];
    };
    public type BountyInput={
        title:Text;
        description:Text;
        tags:[Text];
        reward:Nat;
        currency:Currency;
    };
    public type Bid={
        id:Text;
        freelancerID:Principal;
        bountyID:Text;
        message:Text;
        isApproved:Bool;
        isRejected:Bool;
        resume:Text;
    };
}