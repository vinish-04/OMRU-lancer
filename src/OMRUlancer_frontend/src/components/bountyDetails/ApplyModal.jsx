import React from 'react'
import toast from 'react-hot-toast';
import { RxCross1 } from "react-icons/rx";

const ApplyModal = ({setShowApply,applyForJob,setResume}) => {
    const apply=()=>{
        let msg=document.getElementById('apply-msg').value
        if(msg==""){
            toast.error("Please do not leave fields empty")
            return
        }
        applyForJob(msg)
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
        <label className="apply-resume-inp-label">
            Select resume (in PDF): 
        </label>
        <input 
            accept='application/pdf'
            type="file" 
            className='apply-resume-inp'
            onChange={(e)=>{
              setResume(e.target.files[0])
            //   console.log(profile)
            }}
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