import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from '../../../declarations/OMRUlancer_backend';
import {createActor as IcpCreateActor} from '../../../declarations/icp';
import {createActor as BtcCreateActor} from '../../../declarations/btc';
import {createActor as EthCreateActor} from '../../../declarations/eth';
import { toHex } from '@dfinity/agent';

export const AuthContext = createContext();

export const ids={
    // backend:'a4tbr-q4aaa-aaaaa-qaafq-cai',
    backend:'szbrp-aiaaa-aaaao-a3o5a-cai',
    icp:'ryjl3-tyaaa-aaaaa-aaaba-cai',
    btc:'mxzaz-hqaaa-aaaar-qaada-cai',
    eth:'ss2fx-dyaaa-aaaar-qacoq-cai',
}

export const useAuthClient = (nav) => {
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [actors, setActors] = useState(null);
    const [user,setUser]=useState(null)
        
    const clientInfo = async (client,nav) => {
        const isAuthenticated = await client.isAuthenticated();
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        console.log(toHex(principal))

        setAuthClient(client);
        // setIsAuthenticated(isAuthenticated);
        setIdentity(identity);
        setPrincipal(principal);

        if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
            let backendActor=createActor(ids.backend,{agentOptions:{identity:identity}})
            let icp=IcpCreateActor(ids.icp,{agentOptions:{identity:identity}})
            let eth=EthCreateActor(ids.eth,{agentOptions:{identity:identity}})
            let btc=BtcCreateActor(ids.btc,{agentOptions:{identity:identity}})
            setActors({
                backendActor:backendActor,
                icpActor:icp,
                ethActor:eth,
                btcActor:btc
            })
            console.log({
                backendActor:backendActor,
                icpActor:icp,
                ethActor:eth,
                btcActor:btc
            })
            setIsAuthenticated(true)
            // let userDetails=await backendActor?.getCallerDetails()
            // console.log(userDetails)
            // if(userDetails?.err=="NO user found with this principal"){
            //     nav('/register')
            // }else{
            //     setUser(userDetails?.ok)
            //     nav('/profile')
            // }
            return true
        }

        // return true;
    }

    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            clientInfo(authClient,nav);
        })();
    }, []);

    const login = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                // if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                //     resolve(clientInfo(authClient));
                // } else {
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app/"
                            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                        // identityProvider:"https://identity.ic0.app/",
                        // identityProvider:`http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                        onError: (error) => reject((error)),
                        onSuccess: () => resolve(clientInfo(authClient)),
                    });
                // }
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        setIsAuthenticated(false)
        await authClient?.logout();
    }

    return {
        login, logout, authClient, isAuthenticated, identity, principal, ids, actors,setUser,user
    };
}

export const AuthProvider = ({ children,nav }) => {
    const auth = useAuthClient(nav);
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);