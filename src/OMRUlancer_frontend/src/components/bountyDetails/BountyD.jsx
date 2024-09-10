import React, { useState } from 'react'
import ReactModal from 'react-modal'
import ApplyModal from './ApplyModal'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { imageDB } from '../../../firebaseConfig'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 } from 'uuid'

const tags=[
    "web development","react","node","express","solidity"
]

const BountyD = ({setLoading}) => {

    const job=useSelector(state=>state.job.value)
    const user=useSelector(state=>state.user.value)
    const actor=useSelector(state=>state.actor.value)
    const [showApply,setShowApply]=useState(false)
    const [resume,setResume]=useState("resume")

    async function uploadResume(uri){
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

    async function applyForJob(msg){
        try{
            setLoading(true)
            console.log("applying for job")
            if(resume=="resume"){
                setLoading(false)
                toast.error("Please upload your resume")
                return
            }
            let newResume=await uploadResume(resume)
            let bidRes = await actor?.backendActor?.placeBidOnBounty(job?.id,msg,newResume)
            console.log("bidres : ",bidRes)
            if(bidRes?.err!=undefined){
                toast.error(bidRes?.err)
                setLoading(false)
                return
            }
            toast.success("We have received your application !")
            setLoading(false)
            setShowApply(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    }

  return (
    <div className='bountyd-cont'>
        <h1 className="bountyd-title">{job?.title}</h1>
        <img src="sampleJob.jpg" alt="job" className="bountyd-img" />
        <p className="bountyd-des">
            {job?.description}
        </p>
        <div className="bountyd-tag-cont">
            {
                job?.tags?.map((tag)=>(
                    <p className="bountyd-tag">{tag}</p>
                ))
            }
        </div>
        <div className="bountyd-btn-cont">
            <button className="bountyd-btn" onClick={()=>setShowApply(true)}>Apply</button>
            <button className="bountyd-btn">View applications</button>
        </div>
        <ReactModal
            isOpen={showApply}
            className='modal'
            ariaHideApp={false}
            style={{ 
                overlay: { backdropFilter: 'blur(2px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
            }}
        >
            <ApplyModal setShowApply={setShowApply} applyForJob={applyForJob} setResume={setResume}/>
        </ReactModal>
    </div>
  )
}

export default BountyD