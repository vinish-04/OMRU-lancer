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
import ViewApplications from '../components/profile/modals/ViewApplications'
import Loader from '../components/re-usables/loader/Loader'
import ViewFreelancer from '../components/profile/modals/ViewFreelancer'
import BecomeProviderModal from '../components/profile/modals/BecomeProviderModal'

const UserProfile = () => {

  const [seg,setSeg]=useState(0)
  const {auth}=useContext(AuthContext)
  // const {actors}=useAuthClient()
  const actor=useSelector(state=>state.actor.value)
  const user=useSelector(state=>state.user.value)
  const dispatch=useDispatch()
  const [loading,setLoading]=useState(false)
  const [providerContinue,showProviderContinue]=useState(false)


  const [user2,setUser]=useState({
    img:"img"
  })
  const [bounties,setBounties]=useState([])
  const [bids,setBids]=useState([])
  const [showAddJob,setShowAddJob]=useState(false)
  const [showBids,setShowBids]=useState(false)
  const [showAssigned,setShowAssigned]=useState(false)
  const [currJob,setCurrJob]=useState({})
  const nav=useNavigate()

  async function createJob(data){
    try{
      setLoading(true)
      console.log("job data submit : ",data)
      let resp=await actor?.backendActor?.createBounty(data)
      if(resp?.ok!=undefined){
        toast.success("Your job is successfully created !")
        setShowAddJob(false)
        setLoading(false)
        getUserDetails()
      }else{
        toast.error(resp?.err)
        setLoading(false)
        setShowAddJob(false)
      }
    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }

  async function getUserDetails(){
    console.log("getting user details, actors : ",actor)
    try{
      let res=await actor?.backendActor?.getCallerDetails()
      if(res?.err!=undefined){
        toast.error(res?.err)
        console.log(res?.err)
        return
      }
      console.log(res)
      // console.log(res,res?.ok?.userType,Object.keys(res?.ok?.userType)[0])
      dispatch(updateUser({...res?.ok}))
      setUser({...res?.ok,userType:(res?.ok?.userType!=undefined)?Object?.keys(res?.ok?.userType)[0]:"freelancer"})
      console.log({...res?.ok})
    }catch(err){
      console.log(err)
    }
  }

  async function getUserBids(){
    console.log("getting all bids")
    try{
      let bidList=[]
      for(let i=0;i<user?.bids?.length;i++){
        let bidRes=await actor?.backendActor?.getBidDetails(user?.bids[i])
        if(bidRes?.err!=undefined){
          console.log("err : ",bidRes?.err)
          continue
        }
        let bountyRes=await actor?.backendActor?.getBountyDetails(bidRes?.ok?.bountyID)
        if(bountyRes?.err!=undefined){
          console.log("cannot find bounty : ",bidRes?.ok?.bountyID)
          continue
        }
        let bid={...bidRes?.ok,jobData:bountyRes?.ok}
        bidList.push(bid)
      }
      console.log(bidList)
      setBids(bidList)

    }catch(err){
      console.log(err)
    }
  }

  async function getUserJobs(){
    console.log("executing get user jobs")
    try{
      if(Object?.keys(user?.userType)[0]!="provider"){
        
        return
      }
      let bountyList=[]
      for(let i=0;i<user?.listedBounties?.length;i++){
        let bountyRes=await actor?.backendActor?.getBountyDetails(user?.listedBounties[i])
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
      setLoading(true)
      let res=await actor?.backendActor?.becomeProvider()
      if(res?.err!=undefined){
        toast.error("Something went wrong !")
        console.log(res?.err)
        setLoading(false)
        showProviderContinue()
        return
      }
      toast.success("You are a job provider now")
      setLoading(false)
      showProviderContinue(false)
      getUserDetails()
    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(()=>{
    getUserDetails()
    // console.log("auth",auth)
  },[])

  useEffect(()=>{
    getUserJobs()
    getUserBids()
  },[user])

  useEffect(()=>{
    console.log(providerContinue)
  },[providerContinue])

  return (
    <div className="profile-page">
      <Navbar nav={nav}/>
      <div className="profile-main">
        <ProfileCard user={user} becomeProvider={becomeProvider} showProviderContinue={showProviderContinue}/>
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
              <UserJobList 
                user={user} 
                bounties={bounties} 
                nav={nav} 
                setCurrJob={setCurrJob} 
                setShowBids={setShowBids}
                setShowAssigned={setShowAssigned}
              />
            </>
            :
            <UserApplicationList user={user} bids={bids}/>
          }
        </div>
      </div>
      <ReactModal
        isOpen={providerContinue}
        className='modal'
        ariaHideApp={false}
        style={{ 
            overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
        }}
      >
        <BecomeProviderModal showProviderContinue={showProviderContinue} becomeProvider={becomeProvider}/>
      </ReactModal>
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
      <ReactModal
        isOpen={showBids}
        className='modal'
        ariaHideApp={false}
        style={{ 
            overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
        }}
      >
        <ViewApplications setShowBids={setShowBids} currJob={currJob} setLoading={setLoading}/>
      </ReactModal>
      <ReactModal
        isOpen={showAssigned}
        className='modal'
        ariaHideApp={false}
        style={{ 
            overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
        }}
      >
        <ViewFreelancer 
          setShowAssigned={setShowAssigned} 
          currJob={currJob}
          setLoading={setLoading}
          getUserJobs={getUserJobs}
        />
      </ReactModal>
      <ReactModal
          isOpen={loading}
          className='modal'
          ariaHideApp={false}
          style={{ 
              overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
          }}
        >
        <Loader/>
      </ReactModal>
    </div>
  )
}

export default UserProfile