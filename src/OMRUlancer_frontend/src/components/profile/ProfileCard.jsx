import React from 'react'

const ProfileCard = ({user,becomeProvider}) => {
    console.log("user",user,"val", (user?.img=="img" || user?.img==undefined))
  return (
    <div className="profile-user-detail-cont">
          <img src={
            (user?.img=="img" || user?.img==undefined)?
            "sampleUser.jpg"
            :
            (user?.img)
          }
          alt="user's avatar"
          className="profile-user-img" 
          />
          <div className="profile-user-detail-text-cont">
            <h1 className="profile-name">Name : {user?.username}</h1>
            <p className="profile-email">email : {user?.email}</p>
            <p className="profile-email">profile : {Object.keys(user?.userType)[0]}</p>
          </div>       
          <button className="profile-provider-btn" onClick={becomeProvider}>
            Become Provider
        </button>  
    </div>
  )
}

export default ProfileCard