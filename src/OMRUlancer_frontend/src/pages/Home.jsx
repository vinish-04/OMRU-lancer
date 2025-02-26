import React, { useEffect, useState } from 'react'
import Navbar from '../components/re-usables/navbar/Navbar'
import Footer from '../components/re-usables/footer/Footer'
import Hero from '../components/home/hero-sec/Hero'
import Features from '../components/home/features-sec/Features'
import {useNavigate} from 'react-router-dom'
import FeaturedJobs from '../components/home/jobs/FeaturedJobs'
import { useAuthClient } from '../utils/useAuthClient'
import Loader from '../components/re-usables/loader/Loader'
import ReactModal from 'react-modal'

const Home = ({login}) => {

  const [shouldAnimate,setShouldAnimate]=useState(false)
  const [lastYpos,setLastYpos]=useState(0)
  const nav=useNavigate()
  const {actors,setUser}=useAuthClient()
  const [loading,setLoading]=useState(false)

  useEffect(()=>{

    const handleScroll=()=>{
      let yPos=window.scrollY
      let isScrolling=lastYpos<yPos
      setShouldAnimate(isScrolling)
      setLastYpos(yPos)

    }
    window.addEventListener('scroll',handleScroll,false)
    return ()=>{
      window.removeEventListener('scroll',handleScroll,false)
    }
  },[lastYpos])

  async function verifyUserExist(){
    try{
      console.log(actors)
      let userDetails=await actors?.backendActor?.getCallerDetails()
      if(userDetails==undefined) return
      console.log(userDetails)
      if(userDetails?.err=="NO user found with this principal"){
          nav('/register')
      }else{
          setUser(userDetails?.ok)
          nav('/profile')
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    // verifyUserExist()
  },[actors])

  return (
    <div className='page'>
        <Navbar nav={nav} setLoading={setLoading}/>
        <Hero nav={nav} login={login}/>
        <FeaturedJobs nav={nav}/>
        <Features shouldAnimate={shouldAnimate}/>
        <Footer/>
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

export default Home