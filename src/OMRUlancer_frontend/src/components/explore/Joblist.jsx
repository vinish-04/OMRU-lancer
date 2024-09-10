import React, { useEffect, useState } from 'react'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob } from '../../redux/job/jobSlice';

const idList=[
  "wrzau-uxdzu-jrqka-l4rkr-btl2p-6hgwm-jmid5-uy2wl-drgqq-ij3kf-2ae#0",
  "s56bx-x4jgz-vujp6-kcsdy-ozzpr-kivvv-qfu2l-ddbhc-uzshh-43zfi-2ae#0"
]
const demoBounties = [
    {
      id: "bounty1",
      title: "Find a lost dog",
      description: "My dog, Charlie, went missing near Central Park. He is a small brown poodle with a friendly personality. Please help me find him!",
      tags: ["lost dog", "pet", "reward"],
      isResolved: false,
      providerID: "user123", // Replace with actual principal ID
      assignedTo: null,
      reward: 1000,
      currency: "USD",
      bids: ["$500 - John Doe", "$750 - Jane Smith"],
    },
    {
      id: "bounty2",
      title: "Design a website",
      description: "I need a website designed for my new business. It should be user-friendly and visually appealing. Please submit your portfolio and rates.",
      tags: ["web design", "freelance", "website"],
      isResolved: false,
      providerID: "companyABC", // Replace with actual principal ID
      assignedTo: null,
      reward: 2000,
      currency: "EUR",
      bids: ["$1500 per page - Design Agency", "Custom quote - Freelancer X"],
    },
    {
      id: "bounty3",
      title: "Fix a plumbing leak",
      description: "I have a small leak under my kitchen sink. Need a licensed plumber to diagnose and fix the issue.",
      tags: ["plumbing", "repair", "home improvement"],
      isResolved: true,
      providerID: "user456", // Replace with actual principal ID
      assignedTo: "plumberXYZ", // Replace with actual principal assigned
      reward: 75,
      currency: "USD",
      bids: ["$60 - Reliable Plumbing", "$80 - John's Fix-It Services"],
    },
    {
      id: "bounty4",
      title: "Translate a document",
      description: "I need a document translated from English to Spanish. The document is 5 pages long and covers technical topics.",
      tags: ["translation", "language", "document"],
      isResolved: false,
      providerID: "companyXYZ", // Replace with actual principal ID
      assignedTo: null,
    },
    {
      id: "bounty5",
      title: "Write a blog post",
      description: "Looking for a writer to create a high-quality blog post on the topic of SEO best practices. The post should be around 1000 words.",
      tags: ["content writing", "SEO", "blogging"],
      isResolved: false,
      providerID: "user789", // Replace with actual principal ID
      assignedTo: null,
      reward: 150,
      currency: "USD",
      bids: ["$100 - Content Creator Pro", "$125 - Freelance Writer John"],
    },
  ];


const Joblist = ({nav,loading,setLoading,bounties,setBounties,setFilteredBounties}) => {
  const actor=useSelector(state=>state.actor.value)
  const dispatch=useDispatch()

  async function getBountyDetails(){
    try{
      let bountyList=[]
      for(let i=0;i<idList?.length;i++){
        let bountyRes=await actor?.backendActor?.getBountyDetails(idList[i])
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

  async function getAllJobs(){
    try{
      setLoading(true)
      let bountyList=[]
      let bountyRes=await actor?.backendActor?.getAllJobs(10,1)
      if(bountyRes?.err!=undefined){
        console.log(bountyRes?.err)
        setLoading(false)
        return
      }
      for(let i=0;i<bountyRes?.ok?.length;i++){
        bountyList.push(bountyRes?.ok[i][1])
      }
      console.log(bountyRes?.ok)
      console.log("all jobs : ",bountyList)
      setBounties(bountyList)
      setFilteredBounties(bountyList)
      setLoading(false)
    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(()=>{
    getAllJobs()
  },[])
  return (
    <div className='explore-joblist'>
        {
            bounties?.length>0?
            bounties?.map((bounty,index)=>(
                <div className="e-jobcard" key={index}>
                    <img src="sampleJob.jpg" alt="job " className="e-jobcard-img" />
                    <div className="e-jobcard-detail-cont">
                        <p className="e-jobcard-text">
                        <strong>Title : </strong>
                        {bounty?.title}
                        </p>
                        <p className="e-jobcard-text">
                        <strong>Bounty : </strong>
                        {parseInt(bounty?.reward)/Math.pow(10,8)} {Object.keys(bounty?.currency)[0]}
                        </p>

                        <FaArrowUpRightFromSquare 
                            className='e-jobcard-redirect'
                            onClick={()=>{
                              dispatch(updateJob(bounty))
                              nav('/bounty')
                            }}
                        />
                    </div>
                </div>
            ))
            
            :
            <p className="empty">
                No results found, Try changing the filter
            </p>
        }
    </div>
  )
}

export default Joblist