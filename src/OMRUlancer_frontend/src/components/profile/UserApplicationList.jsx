import React from 'react'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const demoBids = [
  {
    id: "bid1",
    freelancerID: "freelancerABC", // Replace with actual principal ID
    bountyID: "bounty1",
    message: "I can help find your lost dog! I have experience searching for missing pets and a network of animal shelters I can contact. Willing to work for the offered reward.",
  },
  {
    id: "bid2",
    freelancerID: "designAgencyXYZ", // Replace with actual principal ID
    bountyID: "bounty2",
    message: "We can create a user-friendly and visually appealing website for your business. Please check out our portfolio at [link to portfolio] for previous work. Our rates start at $1800 for a basic website.",
  },
  {
    id: "bid3",
    freelancerID: "plumberJohn", // Replace with actual principal ID
    bountyID: "bounty3",
    message: "I'm a licensed plumber with 10 years of experience. I can diagnose and fix your kitchen sink leak quickly and efficiently. My rate is $70 per hour, and I estimate the job will take about an hour.",
  },
  {
    id: "bid4",
    freelancerID: "translatorX", // Replace with actual principal ID
    bountyID: "bounty4",
    message: "I am a native Spanish speaker with experience translating technical documents. I can translate your 5-page document for a flat fee of $175.",
  },
  {
    id: "bid5",
    freelancerID: "writerJane", // Replace with actual principal ID
    bountyID: "bounty5",
    message: "I'm a skilled writer with a strong understanding of SEO best practices. I can write a high-quality 1000-word blog post for you for $130.",
  },
];

// const demoBids=[]

const UserApplicationList = () => {
  return (
    <div className='profile-applications-cont'>
      {
        demoBids?.length>0?
        demoBids.map((bid)=>(
          <div className="p-application-card">
            <p className="p-application-title">
              {bid.bountyID}
            </p>
            <p className="p-application-message">
              {bid.message}
            </p>
            <FaArrowUpRightFromSquare className='p-application-redirect'/>
          </div>
        ))
        :
        <p className="empty">
          No applications to show
        </p>
      }
    </div>
  )
}

export default UserApplicationList