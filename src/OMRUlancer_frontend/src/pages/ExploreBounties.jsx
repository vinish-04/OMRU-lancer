import React from 'react'
import '../components/explore/explore.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/re-usables/navbar/Navbar'
import Joblist from '../components/explore/Joblist'
import Filter from '../components/explore/Filter'

const ExploreBounties = () => {

  const nav=useNavigate()

  return (
    <div className='explore-page'>
      <Navbar nav={nav}/>
      <div className="explore-main">
        <Filter/>
        <Joblist nav={nav}/>
      </div>
    </div>
  )
}

export default ExploreBounties