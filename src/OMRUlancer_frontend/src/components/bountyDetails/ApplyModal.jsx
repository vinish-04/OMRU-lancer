import React from 'react'
import { RxCross1 } from "react-icons/rx";

const ApplyModal = ({setShowApply,applyForJob}) => {
    const apply=()=>{
        let msg=document.getElementById('apply-msg').value
        applyForJob(msg)
        setShowApply(false)
    }
  return (
    <div className='apply-modal'>
        <RxCross1 
            className='close-modal'
            onClick={()=>setShowApply(false)}
        />
        <h1 className="apply-title">Apply for this job</h1>
        <textarea 
            id='apply-msg'
            rows={4}
            cols={30}
            className='apply-message'
            placeholder='Write a messsage to make your application more appealing'
        />
        <button 
            className='apply-btn' 
            onClick={apply}
        >
            Apply
        </button>
    </div>
  )
}

export default ApplyModal