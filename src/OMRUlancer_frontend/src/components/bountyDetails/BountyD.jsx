import React, { useState } from 'react'
import ReactModal from 'react-modal'
import ApplyModal from './ApplyModal'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const tags=[
    "web development","react","node","express","solidity"
]

const BountyD = () => {

    const job=useSelector(state=>state.job.value)
    const user=useSelector(state=>state.user.value)
    const actor=useSelector(state=>state.actor.value)
    const [showApply,setShowApply]=useState(false)

    async function applyForJob(msg){
        try{
            let bidRes = await actor?.placeBidOnBounty(job?.id,msg)
            console.log("bidres : ",bidRes)
            if(bidRes?.err!=undefined){
                toast.error(bidRes?.err)
                return
            }
            toast.success("We have received your apllication !")
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='bountyd-cont'>
        <h1 className="bountyd-title">{job?.title}</h1>
        <img src="sampleJob.jpg" alt="job" className="bountyd-img" />
        <p className="bountyd-des">
            {job?.description}
        </p>
        <div className="bountyd-tag-cont">
            {
                job?.tags?.map((tag)=>(
                    <p className="bountyd-tag">{tag}</p>
                ))
            }
        </div>
        <div className="bountyd-btn-cont">
            <button className="bountyd-btn" onClick={()=>setShowApply(true)}>Apply</button>
            <button className="bountyd-btn">View applications</button>
        </div>
        <ReactModal
            isOpen={showApply}
            className='modal'
            ariaHideApp={false}
            style={{ 
                overlay: { backdropFilter: 'blur(2px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
            }}
        >
            <ApplyModal setShowApply={setShowApply} applyForJob={applyForJob}/>
        </ReactModal>
    </div>
  )
}

export default BountyD