import { useState } from 'react';
import {BrowserRouter as Router,Routes,Route, useNavigate} from 'react-router-dom'
import Home from './pages/Home';
import './App.css'
import VineCity from './pages/VineCity';
import UserProfile from './pages/UserProfile';
import Register from './pages/Register';
import ExploreBounties from './pages/ExploreBounties';
import BountyDetails from './pages/BountyDetails';
import ViewBids from './pages/ViewBids';
import { AuthProvider, ids } from './utils/useAuthClient';
import { Toaster } from 'react-hot-toast';
import { createActor } from '../../declarations/OMRUlancer_backend';
import { AuthClient } from '@dfinity/auth-client';
import { useDispatch } from 'react-redux';
import { updateActor } from './redux/actor/actorSlice';
import { updateUser } from './redux/user/userSlice';
import {createActor as IcpCreateActor} from '../../declarations/icp';
import {createActor as BtcCreateActor} from '../../declarations/btc';
import {createActor as EthCreateActor} from '../../declarations/eth';

function Root() {

  const nav=useNavigate()
  const dispatch=useDispatch()
  const ids={
    // backend:'a4tbr-q4aaa-aaaaa-qaafq-cai',
    backend:'szbrp-aiaaa-aaaao-a3o5a-cai',
    icp:'ryjl3-tyaaa-aaaaa-aaaba-cai',
    btc:'mxzaz-hqaaa-aaaar-qaada-cai',
    eth:'ss2fx-dyaaa-aaaar-qacoq-cai',
}


  async function login(){
    const backendID=ids?.backend
      try {
        const authClient = await AuthClient.create();

        await authClient.login({
                  identityProvider: process.env.DFX_NETWORK === "ic"
                      ? "https://identity.ic0.app/"
                      : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                  identityProvider:"https://identity.ic0.app/",
                  // identityProvider:`http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                  onError: (error) => console.log(error),
                  onSuccess: async() => {
                    let backendActor=createActor(backendID,{
                      agentOptions:{
                        identity:authClient.getIdentity()
                      }
                    })
                    let icpActor=IcpCreateActor(ids.icp,{
                      agentOptions:{
                        identity:authClient.getIdentity()
                      }
                    })
                    let ethActor=EthCreateActor(ids.eth,{
                      agentOptions:{
                        identity:authClient.getIdentity()
                      }
                    })
                    let btcActor=BtcCreateActor(ids.btc,{
                      agentOptions:{
                        identity:authClient.getIdentity()
                      }
                    })
                    dispatch(updateActor({
                      backendActor:backendActor,
                      icpActor:icpActor,
                      ethActor:ethActor,
                      btcActor:btcActor
                  }))
                    let userD=await backendActor.getCallerDetails()
                    console.log("after login : ",userD)
                    if(userD?.err=="NO user found with this principal"){
                      nav('/register')
                    }else{
                      dispatch(updateUser(userD?.ok))
                      nav('/profile')
                    }
                  },
        });



      } catch (error) {
          reject(error);
      }
  }

  // const nav=""
  return (
    <AuthProvider nav={nav}>
    <div className='app'>
        <Routes>
          <Route path='/' element={<Home login={login}/>}/>
          {/* <Route path='/' element={<BountyDetails/>}/> */}
          <Route path='/vision' element={<VineCity/>}/>
          <Route  path='/profile' element={<UserProfile/>}/>
          <Route  path='/register' element={<Register/>}/>
          <Route  path='/explore' element={<ExploreBounties/>}/>
          <Route  path='/bounty' element={<BountyDetails/>}/>
          <Route  path='/bids' element={<ViewBids/>}/>
        </Routes>
        <Toaster/>
    </div>
    </AuthProvider>
  );
}

const App=()=>{
  return(
    <Router>
      <Root/>
    </Router>
  )
}

export default App;
