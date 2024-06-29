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
import { AuthProvider } from './utils/useAuthClient';
import { Toaster } from 'react-hot-toast';
import { createActor } from '../../declarations/OMRUlancer_backend';
import { AuthClient } from '@dfinity/auth-client';
import { useDispatch } from 'react-redux';
import { updateActor } from './redux/actor/actorSlice';
import { updateUser } from './redux/user/userSlice';

function Root() {

  const nav=useNavigate()
  const dispatch=useDispatch()

  async function login(){
    const backendID="bkyz2-fmaaa-aaaaa-qaaaq-cai"
      try {
        const authClient = await AuthClient.create();

        await authClient.login({
            identityProvider: process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/"
              : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                  onError: (error) => console.log(error),
                  onSuccess: async() => {
                    let backendActor=createActor(backendID,{
                      agentOptions:{
                        identity:authClient.getIdentity()
                      }
                    })
                    dispatch(updateActor(backendActor))
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
