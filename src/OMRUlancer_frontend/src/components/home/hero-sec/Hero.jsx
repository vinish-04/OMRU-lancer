import React from 'react'
import './hero.css'
import { motion } from 'framer-motion'
import { useAuthClient } from '../../../utils/useAuthClient'

const Hero = ({nav,login}) => {
  // const {login,actors}=useAuthClient()
  // const authenticate=async()=>{
  //   let res=await login()
  //   console.log("login res : ",res)
  //   if(res){
  //     let userDetails=await actors?.backendActor?.getCallerDetails()
  //     console.log(userDetails)
  //     if(userDetails?.err=="NO user found with this principal"){
  //         nav('/register')
  //     }else{
  //         // setUser(userDetails?.ok)
  //         nav('/profile')
  //     }
  //   }
  // }
  return (
    <div className='hero-sec'>
        <motion.div animate={{x:60}} className="hero-sec-info-cont">
            <h1 className="hero-sec-title">
                A Community of Hustlers
            </h1>
            <h4 className="hero-sec-desc">
                Start you freelancing adventure with our community,
                Exploring all dimensions of success
            </h4>
            <button className='hero-sec-btn' onClick={login}>Get started</button>
        </motion.div>
        <motion.img animate={{scale:1,opacity:1}} transition={{type:"spring",duration:2}} initial={{scale:0,opacity:0}} className='hero-sec-img' src='omru-hero.png' alt="A smiling business person"/>
        <div className="hero-gradient"></div>
    </div>
  )
}

export default Hero