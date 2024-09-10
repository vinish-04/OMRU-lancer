import React from 'react'
import { RxCross1 } from 'react-icons/rx'

const bpg=`

OMRUlancer Bounty Provider Guideline<br/>

Last Updated: July 25th,2024<br/><br/>

 1. Registration<br/><br/>

- Freelancer Registration as Bounty Provider: Freelancers can register as Bounty Providers to post bounties on the platform. They must complete the registration process and agree to the Terms and Conditions.<br/><br/>

 2. Payment Options<br/><br/>

- Bounty Providers can make payments using the following cryptocurrencies: Internet Computer Protocol (ICP), ckBTC, and ckETH.<br/><br/>

 3. Posting Bounties<br/><br/>

- Bounty Providers can post bounties by providing clear and detailed descriptions of the project requirements.<br/>
- Freelancers can browse and bid on available bounties by submitting proposals and resumes.<br/><br/>

 4. Selecting a Freelancer<br/><br/>

- Bounty Providers can review bids and select the most suitable Freelancer by evaluating their proposals and resumes.<br/>
- Upon selecting a Freelancer, the Bounty Provider must pay OMRU-lancer the total bounty price plus a 10% platform fee.<br/>

 5. Project Completion and Payment Release<br/><br/>

- Upon project completion, Bounty Providers can mark the job as done if they are satisfied with the work.<br/>
- Once marked as done, the payment is transferred to the Freelancer.<br/><br/>

 6. Fees and Charges<br/><br/>

- OMRU-lancer charges a 5% platform fee on top of the bounty price, which is payable by the Bounty Provider upon Freelancer selection.<br/><br/>

 7. Dispute Resolution<br/><br/>

- In case of disputes, both parties should first attempt to resolve the issue through direct communication.<br/>
- If unresolved, either party may submit a dispute to OMRU-lancer for mediation.<br/><br/>

For further assistance or inquiries, please contact us at [email address].<br/><br/>

`

const BecomeProviderModal = ({showProviderContinue,becomeProvider}) => {
  return (
    <div className='bpg-main-cont' >
        <RxCross1 className='bpg-close-modal' onClick={()=>showProviderContinue(false)}/>
        <h1 className="bpg-title">Bounty Provider Guidelines</h1>
        <p className="bpg-text" dangerouslySetInnerHTML={{__html:bpg}}>
        {/* {tc} */}
        </p>
        <button className="bpg-btn" onClick={becomeProvider}>
            Agree and continue
        </button>
    </div>
  )
}

export default BecomeProviderModal