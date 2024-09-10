import React from 'react'
import './navbar.css'
import { TbManualGearboxFilled } from 'react-icons/tb'
import { useAuthClient } from '../../../utils/useAuthClient'

const Navbar = ({nav,setLoading}) => {
  const {isAuthenticated,logout,login,actors}=useAuthClient()
  const authenticate=async()=>{
    let res=await login()
    console.log("login res : ",res)
    if(res){
      let userDetails=await actors?.backendActor?.getCallerDetails()
      console.log(userDetails)
      if(userDetails?.err=="NO user found with this principal"){
          nav('/register')
      }else{
          // setUser(userDetails?.ok)
          nav('/profile')
      }
    }
  }
  const logOut=async()=>{
    await logout().then((res)=>{
      nav('/')
    })

  }
  return (
    <div className='navbar'>
        <div className='nav-title'>
          <TbManualGearboxFilled />
          OMRU-lancer
        </div>
        <div className="nav-link-cont">
            <p className="nav-link" onClick={()=>nav('/')}>Home</p>
            {
              !isAuthenticated?
              <p className="nav-link" onClick={()=>nav('/profile')}>Dashboard</p>
              :
              <p className="nav-link" onClick={()=>nav('/profile')}>Dashboard</p>

            }
            <a href='https://vine-city.vercel.app/about' target='blank' className="nav-link">Our Vision</a>
            <p className="nav-link" onClick={()=>nav('/explore')}>Explore</p>
        </div>
        {
          !isAuthenticated?
          <button className='nav-btn' onClick={authenticate}>Join us</button>
          :
          <button className="nav-btn" onClick={logOut}>Log out</button>
        }
    </div>
  )
}

export default Navbar