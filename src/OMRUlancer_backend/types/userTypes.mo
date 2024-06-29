import Text "mo:base/Text";
import Principal "mo:base/Principal";
module{
    public type UserType={
        #freelancer;
        #provider;
    };
    public type Users={
        id:Principal;
        username:Text;
        img:Text;
        listedBounties:[Text];
        userType:UserType;
        email:Text;
        bids:[Text];
    };
    public type UserCreationInput={
        username:Text;
        img:Text;
        email:Text;
    }
}