import React, { useState } from 'react'
import '../components/register/register.css'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { imageDB } from '../../firebaseConfig'
import { useAuthClient } from '../utils/useAuthClient'
import {} from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/re-usables/loader/Loader'
import ReactModal from 'react-modal'
import { FaBedPulse, FaLessThanEqual } from 'react-icons/fa6'
import TNCmodal from '../components/register/TNCmodal'
import { updateUser } from '../redux/user/userSlice'

const Register = () => {

  const [profile,setProfile]=useState("img")
  const [terms,showTerms]=useState(false)
  const [agreed,setAgreed]=useState(false)
  const dispatch=useDispatch()
  const [userData,setUserData]=useState({
    username:"",
    email:""
  })
  const [loading,setLoading]=useState(false)
  // const {actors}=useAuthClient()
  const actor=useSelector(state=>state.actor.value)
  const nav=useNavigate()

  async function uploadImage(uri){
    return new Promise(async(resolve,reject)=>{
      const storageRef = ref(imageDB, 'userImage/' + v4());
      const uploadTask = uploadBytesResumable(storageRef,uri);
  
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.log('Error => ', error);
          reject(new Error("Some error occured while trying to upload images"))
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            console.log('File available at', downloadURL);
            resolve(downloadURL)
          });
        },
      );
    })
    
  };

  async function register(){
    try{
      setLoading(true)
      console.log("register is running")
      let userImg="img"
      if(profile!="img"){
        console.log("uploading image")
        userImg=await uploadImage(profile)
        console.log("done",userImg)
      }
      let userArgs={
        username:userData?.username,
        email:userData?.email,
        img:userImg
      }
      console.log("user data : ",userArgs,userData,actor)
      let res=await actor?.backendActor?.registerUser(userArgs)
      console.log(res,actor?.backendActor?.registerUser)
      if(res?.ok=="User created successfully"){
        let userD=await actor?.backendActor?.getCallerDetails()
        console.log("after login : ",userD)
        if(userD?.ok==undefined){
          return
        }
        dispatch(updateUser(userD?.ok))
        toast.success("You are successfully registered !")
        setLoading(false)
        nav('/profile')
      }else{
        toast.error(res?.err)
        console.log(res?.err)
        setLoading(false)
      }
    }catch(err){
      console.log(err)
      toast.error("Something went wrong !")
      setLoading(false)
    }
    
  }
  return (
    <div className='page-new'>
      <div className="register-card">
        <h1 className="register-title">Get started with </h1>
        <h2 className='register-title2'>OMRU-lancer</h2>
        <form className='register-form' onSubmit={
          (e)=>{
            e.preventDefault()
            console.log(agreed)
            if(!agreed){
              toast.error('Please agree to ours terms')
              return
            }
            // toast.error('agree',agreed)
            register()
          }
        }>
          <img 
            src={
              (profile=="img")?
              "sampleUser.jpg"
              :
              URL.createObjectURL(profile)
            } 
            alt="user profile" 
            className='register-img'
          />
          <input 
            type="file" 
            className='register-img-inp'
            onChange={(e)=>{
              setProfile(e.target.files[0])
              console.log(profile)
            }}
          />
          <input 
            required
            type="text" 
            className="register-text-inp" 
            placeholder='Username'
            onChange={(e)=>{
              console.log(e.target.value)
              setUserData({...userData,username:e.target.value})
            }}
          />
          <input 
            required
            type="email" 
            className="register-text-inp" 
            placeholder='Email'
            onChange={(e)=>{
              setUserData({...userData,email:e.target.value})
            }}
          />
          <div className="register-terms-cont">
            <input value={agreed} onChange={(e)=>setAgreed(e.target.checked)} type="checkbox" id='register-terms-agree-check' className="register-terms-agree-check" />
            <p className="register-terms-agree-text">
              Agree to <em onClick={()=>showTerms(true)}>Terms and Conditions</em>
            </p>
          </div>
          <button type='submit' className="register-btn">Register</button>
        </form>
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
      <ReactModal
          isOpen={terms}
          className='modal'
          ariaHideApp={false}
          style={{ 
              overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
          }}
        >
        <TNCmodal showTerms={showTerms}/>
      </ReactModal>
    </div>
  )
}

export default Register