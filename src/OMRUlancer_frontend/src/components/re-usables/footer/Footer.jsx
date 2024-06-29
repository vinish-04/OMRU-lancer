import React from 'react'
import './footer.css'
import { BsTwitterX, BsLinkedin, BsDiscord } from 'react-icons/bs'
import { PiRedditLogoFill } from 'react-icons/pi'

const Footer = () => {
    const year=new Date().getFullYear()
  return (
    <div className='footer'>
        {/* <img src="logo2.svg" alt="vinish emblem" className='footer-logo'/> */}
        <p className="footer-text">
            OMRUlancer is the precursor to Vine City and is dedicated to the cause of supporting and encouraging freelancers in their path of success
        </p>
        <div className="footer-icon-cont">
            <BsTwitterX className='footer-icon'/>
            <BsLinkedin className='footer-icon' />
            <PiRedditLogoFill className='footer-icon' />
            <BsDiscord className='footer-icon'/>
        </div>
        <div className="footer-link-cont">
            <p className="footer-link">Privacy</p>
            <p className="footer-link">Terms & Conditions</p>
            <p className="footer-link">Communities</p>
            <p className="footer-link">Vision</p>
            <p className="footer-link">White paper</p>
        </div>
        <p className="footer-copyright">Copyright@{year}</p>
    </div>
  )
}

export default Footer