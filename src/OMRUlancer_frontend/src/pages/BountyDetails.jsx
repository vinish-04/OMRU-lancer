import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/re-usables/navbar/Navbar'
import '../components/bountyDetails/bountyDetails.css'
import BountyD from '../components/bountyDetails/BountyD'
import ReactModal from 'react-modal'

const BountyDetails = () => {

  const nav=useNavigate()

  return (
    <div className='bountyd-page'>
      <Navbar nav={nav}/>
      <div className="bountyd-main">
        <BountyD/>
      </div>
    </div>
  )
}

export default BountyDetails