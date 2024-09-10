import React, { useEffect, useState } from 'react'
import '../components/explore/explore.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/re-usables/navbar/Navbar'
import Joblist from '../components/explore/Joblist'
import Filter from '../components/explore/Filter'
import ReactModal from 'react-modal'
import Loader from '../components/re-usables/loader/Loader'

const ExploreBounties = () => {

  const nav=useNavigate()
  const [loading,setLoading]=useState(false)
  const [bounties,setBounties]=useState([])
  const [filteredBounties,setFilteredBounties]=useState([])

  useEffect(()=>{
    console.log("load",loading)
  },[loading])

  return (
    <div className='explore-page'>
      <Navbar nav={nav}/>
      <div className="explore-main">
        <Filter 
          setLoading={setLoading} 
          bounties={bounties} 
          setBounties={setFilteredBounties}
        />
        <Joblist 
          nav={nav} 
          loading={loading} 
          setLoading={setLoading}
          setBounties={setBounties}
          bounties={filteredBounties}
          setFilteredBounties={setFilteredBounties}
        />
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

export default ExploreBounties