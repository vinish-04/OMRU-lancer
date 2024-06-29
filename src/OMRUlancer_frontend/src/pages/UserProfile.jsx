import React, { useContext, useEffect, useState } from 'react'
import '../components/profile/profile.css'
import { AuthContext, useAuthClient } from '../utils/useAuthClient'
import toast from 'react-hot-toast'
import Navbar from '../components/re-usables/navbar/Navbar'
import ProfileCard from '../components/profile/ProfileCard'
import UserJobList from '../components/profile/UserJobList'
import UserApplicationList from '../components/profile/UserApplicationList'
import { useNavigate } from 'react-router-dom'
import ReactModal from 'react-modal'
import { FaBedPulse } from 'react-icons/fa6'
import AddJobModal from '../components/profile/modals/AddJobModal'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../redux/user/userSlice'

const UserProfile = () => {

  const [seg,setSeg]=useState(0)
  const {auth}=useContext(AuthContext)
  // const {actors}=useAuthClient()
  const actor=useSelector(state=>state.actor.value)
  const user=useSelector(state=>state.user.value)
  const dispatch=useDispatch()


  const [user2,setUser]=useState({
    img:"img"
  })
  const [bounties,setBounties]=useState([])
  const [bids,setBids]=useState([])
  const [showAddJob,setShowAddJob]=useState(false)
  const nav=useNavigate()

  async function createJob(data){
    try{
      console.log("job data submit : ",data)
      let resp=await actor?.createBounty(data)
      if(resp?.ok!=undefined){
        toast.success("Your job is successfully created !")
        setShowAddJob(false)
        getUserDetails()
      }else{
        toast.error(resp?.err)
        setShowAddJob(false)
      }
    }catch(err){
      console.log(err)
    }
  }

  async function getUserDetails(){
    console.log("getting user details, actors : ",actor)
    try{
      let res=await actor?.getCallerDetails()
      if(res?.err!=undefined){
        toast.error(res?.err)
        console.log(res?.err)
        return
      }
      console.log(res)
      // console.log(res,res?.ok?.userType,Object.keys(res?.ok?.userType)[0])
      setUser({...res?.ok,userType:(res?.ok?.userType!=undefined)?Object.keys(res?.ok?.userType)[0]:"freelancer"})
      dispatch(updateUser({...res?.ok}))
      console.log({...res?.ok})
    }catch(err){
      console.log(err)
    }
  }

  async function getUserJobs(){
    console.log("executing get user jobs")
    try{
      if(Object.keys(user?.userType)[0]!="provider"){
        
        return
      }
      let bountyList=[]
      for(let i=0;i<user?.listedBounties?.length;i++){
        let bountyRes=await actor?.getBountyDetails(user?.listedBounties[i])
        if(bountyRes?.err!=undefined){
          console.log(bountyRes?.err)
          continue
        }
        bountyList.push(bountyRes?.ok)
      }
      console.log(bountyList)
      setBounties(bountyList)
    }catch(err){
      console.log(err)
    }
  }

  async function becomeProvider(){
    console.log("executing become provider")
    try{
      let res=await actor?.becomeProvider()
      if(res?.err!=undefined){
        toast.error("Something went wrong !")
        console.log(res?.err)
        return
      }
      toast.success("You are a job provider now")
      getUserDetails()
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getUserDetails()
    // console.log("auth",auth)
  },[])

  useEffect(()=>{
    getUserJobs()
  },[user])

  return (
    <div className="profile-page">
      <Navbar nav={nav}/>
      <div className="profile-main">
        <ProfileCard user={user} becomeProvider={becomeProvider}/>
        <div className="profile-interactive-cont">
          <div className="profile-seg-cont">
            <h1 
              className={(seg==0)?"profile-seg-title seg-title-highlight":"profile-seg-title"} 
              onClick={()=>setSeg(0)}
            >
              Jobs Listed
            </h1>
            <h1 
              className={(seg==1)?"profile-seg-title seg-title-highlight":"profile-seg-title"} 
              onClick={()=>setSeg(1)}
            >
              Applied on
            </h1>
          </div>
          {
            seg==0?
            <>
              <button 
                className="p-addjob"
                onClick={()=>setShowAddJob(true)}
              >
                Add new job
              </button>
              <UserJobList user={user} bounties={bounties} nav={nav}/>
            </>
            :
            <UserApplicationList user={user} applications={bids}/>
          }
        </div>
      </div>
     <ReactModal
        isOpen={showAddJob}
        className='modal'
        ariaHideApp={false}
        style={{ 
            overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
        }}
      >
        <AddJobModal setShowAddJob={setShowAddJob} createJob={createJob}/>  
      </ReactModal>
    </div>
  )
}

export default UserProfile