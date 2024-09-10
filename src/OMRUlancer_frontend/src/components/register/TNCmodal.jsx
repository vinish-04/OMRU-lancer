import React from 'react'
import {RxCross1} from 'react-icons/rx'

const tc=`
OMRU-lancer Terms and Conditions<br/><br/>

Last Updated: August 2nd, 2024<br/><br/>

Welcome to OMRU-lancer, a freelancing platform connecting bounty providers and freelancers worldwide. By accessing or using our services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
<br/><br/>
 1. Definitions
<br/><br/>
- Platform: Refers to OMRU-lancer, accessible via [website URL] and any related applications.<br/><br/>
- User: Any individual or entity using the Platform, including Bounty Providers and Freelancers.<br/><br/>
- Bounty Provider: A User who requests services from Freelancers on the Platform by posting bounties.<br/><br/>
- Freelancer: A User who offers services to Bounty Providers on the Platform.<br/><br/>
- Project: Any task or set of tasks agreed upon between a Bounty Provider and Freelancer, referred to as a "Bounty."<br/><br/>
<br/><br/>
 2. Eligibility<br/><br/>

- Users must be at least 18 years old to register and use the Platform.<br/><br/>
- By using the Platform, you represent and warrant that you have the legal capacity to enter into these Terms.<br/><br/>

 3. Account Registration<br/><br/>

- Users must create an account to access certain features of the Platform.<br/><br/>
- Users are responsible for maintaining the confidentiality of their account information.<br/><br/>
- Users agree to provide accurate and complete information during registration.<br/><br/>

 4. User Obligations<br/><br/>

 4.1 Bounty Providers<br/><br/>

- Must provide clear and accurate bounty descriptions and requirements.<br/><br/>
- Agree to pay Freelancers in accordance with the agreed terms and the Platform’s payment policies.<br/><br/>
<br/><br/>
 4.2 Freelancers<br/><br/>

- Must deliver high-quality work in accordance with the agreed bounty specifications.<br/><br/>
- Agree to complete bounties within the agreed timeframe.<br/><br/>
<br/><br/>
 5. Payment Terms<br/><br/>
- Payments are processed through the Platform’s secure payment system.<br/><br/>
- Bounty Providers are required to fund bounties upfront. Funds will be held in escrow and released upon bounty completion and approval.<br/><br/>
- OMRU-lancer charges a 5% service fee on all transactions.<br/><br/>
<br/><br/>
 6. Dispute Resolution<br/><br/>

- Any disputes between Bounty Providers and Freelancers should first be attempted to be resolved through direct communication.<br/><br/>
- If a resolution cannot be reached, Users can submit a dispute to OMRU-lancer for mediation.<br/><br/>
<br/><br/>
 7. Prohibited Activities<br/><br/>

Users agree not to:<br/><br/>

- Engage in any form of harassment, discrimination, or abusive behavior.<br/><br/>
- Use the Platform for any illegal or unauthorized purpose.<br/><br/>
- Share, distribute, or use another User's content without permission.<br/><br/>

 8. Intellectual Property<br/><br/>

- Users retain ownership of their content and grant OMRU-lancer a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content on the Platform.<br/><br/>

 9. Termination<br/><br/>

- OMRU-lancer reserves the right to suspend or terminate User accounts for any violation of these Terms or for any other reason at its sole discretion.<br/><br/>

 10. Limitation of Liability<br/><br/>

- OMRU-lancer is not liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to the use of the Platform.<br/><br/>

 11. Indemnification<br/><br/>

- Users agree to indemnify and hold OMRU-lancer harmless from any claims, losses, liabilities, damages, costs, and expenses arising out of or related to their use of the Platform.<br/><br/>

 12. Modifications<br/><br/>

- OMRU-lancer reserves the right to modify these Terms at any time. Changes will be posted on the Platform, and continued use constitutes acceptance of such changes.<br/><br/>

 13. Governing Law<br/><br/>

- These Terms are governed by the laws of [Jurisdiction]. Any legal actions arising from these Terms must be brought in the courts located in [Location].<br/><br/>

 14. Contact Information<br/><br/>

For questions or concerns regarding these Terms, please contact us at [email address].<br/><br/>

`

const TNCmodal = ({showTerms}) => {
  return (
    <div className='tnc-main-cont' >
      <RxCross1 className='tnc-close-modal' onClick={()=>showTerms(false)}/>
      <h1 className="tnc-title">Terms and Conditions</h1>
      <p className="tnc-text" dangerouslySetInnerHTML={{__html:tc}}>
        {/* {tc} */}
      </p>
      <button className="tnc-btn" onClick={()=>showTerms(false)}>
        I Understand
      </button>
    </div>
  )
}

export default TNCmodal