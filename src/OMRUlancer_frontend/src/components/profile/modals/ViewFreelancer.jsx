import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RxCross1 } from 'react-icons/rx'
import { useSelector } from 'react-redux'

const ViewFreelancer = ({setShowAssigned,currJob,setLoading,getUserJobs}) => {
    // console.log(currJob)

    const actor=useSelector(state=>state.actor.value)
    const [freelancer,setFreelancer]=useState({})

    async function getFreelancerDetails(){
        try{
            console.log(currJob?.assignedTo)
            let res=await actor?.backendActor?.getUserDetails(currJob?.assignedTo[0])
            if(res?.err!=undefined){
                console.log(res?.err)
                return
            }
            console.log("freelancer : ",res?.ok)
            setFreelancer(res?.ok)
        }catch(err){
            console.log(err)
        }
    }
    async function markAsComplete(){
        try{
            setLoading(true)
            let res=await actor?.backendActor?.resolveBounty(currJob?.id)
            console.log(res)
            if(res?.err!=undefined){
                setLoading(false)
                toast.error(res?.err)
                return
            }
            getUserJobs()
            toast.success(res?.ok)
            setLoading(false)
            setShowAssigned(false)

        }catch(err){
            console.log(err)
            toast.error("Something went wrong")
            setLoading(false)
        }
    }

    useEffect(()=>{
        getFreelancerDetails()
    },[])
    
  return (
    <div className='view-assigned-modal-cont'>
        <RxCross1 
            className='close-modal'
            onClick={()=>setShowAssigned(false)}
        />
        <h1 className="vam-title">{currJob?.title}</h1>
        <div className="vam-row-item">
            <p className="vam-r-label">Name :</p>
            <p className="vam-r-value">{freelancer?.username}</p>
        </div>
        <div className="vam-row-item">
            <p className="vam-r-label">Email :</p>
            <p className="vam-r-value">{freelancer?.email}</p>
        </div>
        <div className="vam-row-item">
            <p className="vam-r-label">Job Status :</p>
            {
                !currJob?.isResolved?
                <p className="vam-r-value" style={{color:'red'}}>
                    On-going
                </p>
                :
                <p className="vam-r-value" style={{color:'green'}}>
                    Completed
                </p>
            }
        </div>
        {
            !currJob?.isResolved?
            <button className="vam-mark-btn" onClick={markAsComplete}>
                Mark as Complete
            </button>
            :
            <></>
        }

    </div>
  )
}

export default ViewFreelancer