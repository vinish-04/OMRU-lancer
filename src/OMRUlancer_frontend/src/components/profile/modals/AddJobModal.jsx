import React from 'react'
import './profileModals.css'
import { RxCross1 } from "react-icons/rx";

const currency=[
  {icp:null},
  {ckbtc:null},
  {
    cketh:null
  }
]

const AddJobModal = ({setShowAddJob,createJob}) => {
  async function jobcreation(){
    const title=document.querySelector('#job-t').value
    const des=document.querySelector('#job-des').value
    const reward=parseInt(document.querySelector('#job-r').value)
    const cur=document.querySelector('#job-cur').value
    console.log(title,des,reward,cur)
    createJob({
      title:title,
      description:des,
      tags:["job","demo","bounty"],
      reward:reward,
      currency:currency[cur-1]
    })
  }
  return (
    <div className='addjob-modal'>
      <RxCross1 
            className='close-modal'
            onClick={()=>setShowAddJob(false)}
        />
      <h1 className="addjob-title">List a new Job</h1>
      <input 
        id='job-t'
        type="text" 
        className="addjob-title-inp"
        placeholder='Add a title to job'
      />
      <textarea  
        id="job-des" 
        className="addjob-des-inp" 
        row={10} 
        cols={30}
        placeholder='Add a description to job'
      />
      <input 
          id='job-r'
          type="number" 
          className="addjob-reward-inp" 
          placeholder='Add a reward price'
        />
      <div className="addjob-reward-cont">
        <p className="addjob-cur-label">Select currency : </p>
        <select className="addjob-reward-cur" id='job-cur'>
          <option value="1" className="addjob-reward-cur-op">ICP</option>
          <option value="2" className="addjob-reward-cur-op">ckBTC</option>
          <option value="3" className="addjob-reward-cur-op">ckETH</option>
        </select>
      </div>
      <button className="addjob-sub-btn" onClick={jobcreation}>
        Add job
      </button>
    </div>
  )
}

export default AddJobModal