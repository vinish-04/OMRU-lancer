import React from 'react'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { updateJob } from '../../redux/job/jobSlice';
import { Principal } from '@dfinity/principal';
import { ids } from '../../utils/useAuthClient';

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
const bounties = [
  {
    id: "bounty1",
    title: "Find a lost dog",
    description: "My dog, Charlie, went missing near Central Park. He is a small brown poodle with a friendly personality. Please help me find him!",
    tags: ["lost dog", "pet", "reward"],
    isResolved: false,
    providerID: "user123", // Replace with actual principal ID
    assignedTo: "placeholder_unassigned", // Temporary value indicating unassigned
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
    assignedTo: "placeholder_unassigned", // Temporary value indicating unassigned
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
    assignedTo: "placeholder_unassigned", // Temporary value indicating unassigned
    reward: 150,
    currency: "USD",
    bids: ["$100 per page - Translator A", "$120 per page - Translator B"], // Placeholder bids
  },
  {
    id: "bounty5",
    title: "Write a blog post",
    description: "Looking for a writer to create a high-quality blog post on the topic of SEO best practices. The post should be around 1000 words.",
    tags: ["content writing", "SEO", "blogging"],
    isResolved: false,
    providerID: "user789", // Replace with actual principal ID
    assignedTo: "placeholder_unassigned", // Temporary value indicating unassigned
    reward: 150,
    currency: "USD",
    bids: ["$100 - Content Creator Pro", "$125 - Freelance Writer John"],
  },
];
// const demoBounties=[]
// console.log(bounties);


const UserJobList = ({bounties,user,nav,setCurrJob,setShowBids,setShowAssigned}) => {

  const job=useSelector(state=>state.job.value)
  const dispatch=useDispatch()
  // console.log(bounty?.assignedTo)
  return (
    <div className='profile-joblist-cont'>
      
      {
        bounties?.length>0?
        bounties?.map((bounty)=>(
          <div className="profile-job-card">
            <img src="sampleJob.jpg" alt="job" className="p-jobcard-img" />
            <div className="p-jobcard-detail-cont">
                <p className="p-jobcard-text">
                  <strong>Title : </strong>
                  {bounty?.title}
                </p>
                <p className="p-jobcard-text">
                  <strong>Bounty : </strong>
                  {parseInt(bounty?.reward)/Math.pow(10,8)} {Object.keys(bounty?.currency)[0]}
                </p>
                {
                  // console.log(bounty?.assignedTo[0],bounty?.assignedTo,bounty?.assignedTo==[],bounty?.assignedTo?._isPrincipal?.[0]==undefined,Principal.fromText(ids.backend)?._isPrincipal)
                  bounty?.assignedTo[0]==undefined?
                  <p className="p-jobcard-text2" onClick={()=>{
                    setCurrJob(bounty)
                    setShowBids(true)
                  }}>
                    View Applications
                  </p>
                  :
                  <p className="p-jobcard-text2" onClick={()=>{
                    setCurrJob(bounty)
                    setShowAssigned(true)
                  }}>
                    View Freelancer assigned
                  </p>
                }

                <FaArrowUpRightFromSquare 
                  className='p-jobcard-redirect'
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
          No jobs to show
        </p>
      }

    </div>
  )
}

export default UserJobList