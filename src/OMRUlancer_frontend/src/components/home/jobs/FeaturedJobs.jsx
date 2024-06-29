import React from 'react'
import './jobs.css'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'

const jobList=[
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
]

const FeaturedJobs = ({nav}) => {
  return (
    <div className='f-job-sec'>
        <h1 className="f-sec-title">Featured Bounties</h1>
        <div className="f-job-card-cont">
            {
                jobList?.map((job)=>(
                    <div className="f-jobcard">
                        <img src="sampleJob.jpg" alt="job" className="f-jobcard-img" />
                        <div className="f-jobcard-detail-cont">
                            <p className="f-jobcard-text">
                            <strong>Title : </strong>
                            {job?.title}
                            </p>
                            <p className="f-jobcard-text">
                            <strong>Bounty : </strong>
                            {job?.reward} {job?.currency}
                            </p>

                            <FaArrowUpRightFromSquare 
                                className='f-jobcard-redirect'
                                onClick={()=>nav('/bounty')}
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default FeaturedJobs
