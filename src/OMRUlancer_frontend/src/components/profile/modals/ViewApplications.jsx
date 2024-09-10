import React, { useEffect, useState } from 'react'
import './profileModals.css'
import { RxCross1 } from 'react-icons/rx'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import { ids } from '../../../utils/useAuthClient';
import { formatTokenMetaData } from '../../../utils/formatingFunctions';

const ViewApplications = ({setShowBids,currJob,setLoading}) => {
    const [bids,setBids]=useState([])
    const [currBid,setCurrBid]=useState({})
    const actor=useSelector(state=>state.actor.value)
    const user=useSelector(state=>state.user.value)

    async function approve(){
        try{
            setLoading(true)
            console.log("approve running")
            let paymentMethod=Object.keys(currJob?.currency)[0]
            let ledgerActor=null
            if(paymentMethod=="ckbtc"){
                ledgerActor=actor?.btcActor
            }else if(paymentMethod=="cketh"){
                ledgerActor=actor?.ethActor
            }else{
                ledgerActor=actor?.icpActor
            }
            let metadata=formatTokenMetaData(await ledgerActor?.icrc1_metadata())
            let userBalance=await ledgerActor?.icrc1_balance_of({
                owner:user?.id,
                subaccount:[]
            })
            console.log(userBalance,currJob?.reward,paymentMethod,metadata)
            if(parseInt(userBalance)<(parseInt(currJob?.reward)+parseInt(metadata?.["icrc1:fee"]))){
                toast.error("In-sufficient balance")
                setLoading(false)
                return
            }
            let transaction = {
                amount: parseInt(currJob?.reward) + parseInt(metadata?.['icrc1:fee']),
                from_subaccount: [],
                spender: {
                  owner: Principal.fromText(ids.backend),
                  subaccount: [],
                },
                fee: [metadata?.['icrc1:fee']],
                memo: [],
                created_at_time: [],
                expected_allowance: [],
                expires_at: [],
              };
            let approveRes=await ledgerActor?.icrc2_approve(transaction)
            console.log(approveRes)
            if(approveRes?.Err!=undefined){
                toast.error("Some error occured while approving the transaction")
                setLoading(false)
                return
            }
            let assignRes=await actor?.backendActor?.assignBounty(currBid)
            console.log(assignRes)
            if(assignRes?.err!=undefined){
                setLoading(false)
                toast.error(assignRes?.err)
                return
            }
            toast.success("You have assigned this freelancer for the job")
            setShowBids(false)
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
            toast.error("Something went wrong")
        }
    }

    async function rejectBid(){
        try{
            setLoading(true)
            let rejectRes=await actor?.backendActor?.rejectBid(currBid)
            console.log("reject res : ",rejectRes)
            if(rejectRes?.err!=undefined){
                toast.error("Something went wrong while rejecting this bid")
                getAllBids()
                setLoading(false)
                return
            }
            getAllBids()
            toast.success("Successfull rejected this bid")
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }

    async function getAllBids(){
        try{
            console.log(currJob)
            let bidList=[]
            for(let i=0;i<currJob?.bids?.length;i++){
                let bidRes=await actor?.backendActor?.getBidDetails(currJob?.bids[i])
                if(bidRes?.err!=undefined){
                    console.log(bidRes?.err)
                    continue
                }
                console.log(bidRes?.ok)
                if(bidRes?.ok?.isRejected){
                    console.log("This bid is already rejected!")
                    continue
                }
                let userRes=await actor?.backendActor?.getUserDetails(bidRes?.ok?.freelancerID)
                if(userRes?.err!=undefined){
                    console.log(userRes?.err)
                    continue
                }
                console.log(userRes?.ok)
                bidList.push({...bidRes?.ok,userData:userRes?.ok})
            }
            console.log(bidList)
            setBids(bidList)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getAllBids()
    },[])

    const demoBids=[
        {
            id:1,
            message:"mwindiewnfje fenfinefew fjneifniew fefnienfi ef eibfiefe fi eifeif ewf",
            title:"wdnsdmskd1"
        },
        {
            id:2,
            message:"mwindiewnfje fenfinefew fjneifniew fefnienfi ef eibfiefe fi eifeif ewf",
            title:"wdnsdmskd2"
        },
        {
            id:3,
            message:"mwindiewnfje fenfinefew fjneifniew fefnienfi ef eibfiefe fi eifeif ewf",
            title:"wdnsdmskd3"
        },
        {
            id:4,
            message:"mwindiewnfje fenfinefew fjneifniew fefnienfi ef eibfiefe fi eifeif ewf",
            title:"wdnsdmskd4"
        },
    ]

  return (
    <div className='view-job-bids-cont'>
        <RxCross1 
            className='close-modal'
            onClick={()=>setShowBids(false)}
        />
        <div className="view-job-bids-title">Application for "{currJob?.title}"</div>
        {
            bids?.length>0?
            bids?.map((bid)=>{
                if(!bid?.isRejected){
                    return(
                        <div className="job-bid-cont">
                            <div className="job-bid-header">
                                <h1 className="job-bid-name">{bid?.userData?.username}</h1>
                                {
                                    bid?.id==currBid?
                                    <MdOutlineKeyboardArrowUp className='job-bid-icon' onClick={()=>{
                                        setCurrBid({})
                                    }}/>
                                    :
                                    <MdOutlineKeyboardArrowDown className='job-bid-icon' onClick={()=>{
                                        setCurrBid(bid?.id)
                                    }}/>
                                }
                            
                                
                            </div>
                            {
                                bid?.id==currBid?
                                <div className="job-bid-msg-cont">
                                    <p className="job-bid-msg">
                                        {
                                            bid?.message
                                        }
                                    </p>
                                    <div className="job-approve-link-cont">
                                        <p className="job-approve-link1" onClick={()=>{
                                            approve()
                                        }}>
                                            Approve 
                                        </p>
                                        <p className="job-approve-link2" onClick={()=>{
                                            rejectBid()
                                        }}>
                                            Reject 
                                        </p>
                                        <a target='blank' href={bid?.resume} className="job-approve-link3">
                                            See resume
                                        </a>
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </div>
                    )
                }
            })
            
            :
            <p className="view-job-bids-empty">
                No applications on this job
            </p>
        }
    </div>
  )
}

export default ViewApplications