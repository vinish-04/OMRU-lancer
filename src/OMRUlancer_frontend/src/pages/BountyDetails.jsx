import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/re-usables/navbar/Navbar'
import '../components/bountyDetails/bountyDetails.css'
import BountyD from '../components/bountyDetails/BountyD'
import ReactModal from 'react-modal'
import Loader from '../components/re-usables/loader/Loader'

const BountyDetails = () => {

  const [loading,setLoading]=useState(false)

  const nav=useNavigate()

  return (
    <div className='bountyd-page'>
      <Navbar nav={nav}/>
      <div className="bountyd-main">
        <BountyD setLoading={setLoading}/>
      </div>
      <ReactModal
          isOpen={loading}
          className='modal'
          ariaHideApp={false}
          style={{ 
              overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
          }}
        >
        <Loader/>
      </ReactModal>
    </div>
  )
}

export default BountyDetails