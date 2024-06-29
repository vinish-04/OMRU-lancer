import React, { useState } from 'react'
import '../components/register/register.css'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { imageDB } from '../../firebaseConfig'
import { useAuthClient } from '../utils/useAuthClient'
import {} from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

const Register = () => {

  const [profile,setProfile]=useState("img")
  const [userData,setUserData]=useState({
    username:"",
    email:""
  })
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

  async function register(e){
    try{
      console.log("register is running")
      e.preventDefault()
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
      let res=await actor?.registerUser(userArgs)
      console.log(res,actor?.registerUser)
      if(res?.ok=="User created successfully"){
        toast.success("You are successfully registered !")
        nav('/profile')
      }else{
        toast.error(res?.err)
        console.log(res?.err)
      }
    }catch(err){
      console.log(err)
      toast.error("Something went wrong !")
    }
    
  }
  return (
    <div className='page-new'>
      <div className="register-card">
        <h1 className="register-title">Get started with </h1>
        <h2 className='register-title2'>OMRU-lancer</h2>
        <form className='register-form' onSubmit={register}>
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
          <button type='submit' className="register-btn">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register