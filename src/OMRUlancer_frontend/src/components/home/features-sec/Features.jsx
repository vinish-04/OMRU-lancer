import React from 'react'
import './features.css'
import { TbClockHour5 } from "react-icons/tb";
import { RiGlobalFill } from "react-icons/ri";
import { IoIosInfinite } from "react-icons/io";
import FeatureCard from './FeatureCard'

const Features = ({shouldAnimate}) => {

  const features=[
    {
      icon:<TbClockHour5 className='feature-card-icon'/>,
      title:"Support for all",
      desc:"Our platfor provides 24/7 support for freelancers"
    },
    {
      icon:<IoIosInfinite className='feature-card-icon'/>,
      title:"Fast Crypto payment",
      desc:"Supports fast payment in ICP, ckETH and ckBTC"
    },
    {
      icon:<RiGlobalFill className='feature-card-icon'/>,
      title:"Beyond boundaries",
      desc:"Work in organisations across the world without the need of nationality"
    }
  ]

  return (
    <div className='features-sec'>
        <h1 className="features-sec-title">Our Key Features</h1>
        <div className="feature-card-cont">
            {
              features.map((feature)=>(
                <FeatureCard feature={feature} shouldAnimate={shouldAnimate}/>
              ))
            }
        </div>
    </div>
  )
}

export default Features