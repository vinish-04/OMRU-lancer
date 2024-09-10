import React from 'react'
import { TbClockHour5 } from "react-icons/tb";
import './features.css'
import { motion } from 'framer-motion';

const FeatureCard = ({feature,shouldAnimate}) => {
  return (
    <motion.div animate={{opacity:shouldAnimate?1:0}} transition={{duration:1}} className='feature-card'>
     <h1 className="feature-card-title">{feature?.title}</h1>
        {
          feature?.icon
        }
        <p className="feature-card-desc">{feature?.desc}</p>
    </motion.div>
  )
}

export default FeatureCard