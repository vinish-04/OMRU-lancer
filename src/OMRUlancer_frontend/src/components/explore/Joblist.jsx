import React from 'react'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';


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

const Joblist = ({nav}) => {
  return (
    <div className='explore-joblist'>
        {
            demoBounties?.length>0?
            demoBounties?.map((bounty)=>(
                <div className="e-jobcard">
                    <img src="sampleJob.jpg" alt="job" className="e-jobcard-img" />
                    <div className="e-jobcard-detail-cont">
                        <p className="e-jobcard-text">
                        <strong>Title : </strong>
                        {bounty?.title}
                        </p>
                        <p className="e-jobcard-text">
                        <strong>Bounty : </strong>
                        {bounty?.reward} {bounty?.currency}
                        </p>

                        <FaArrowUpRightFromSquare 
                            className='e-jobcard-redirect'
                            onClick={()=>nav('/bounty')}
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