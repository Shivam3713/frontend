// hubspot.js
import { Box, Button, CircularProgress } from "@mui/material";
import axios from 'axios'
import { useEffect, useState } from "react";

export const HubSpotIntegration =({user, org, integrationParams, setIntegrationParams})=>{
    const [isconnected, setIsConnected]= useState(false)
    const [isConnecting, setIsConnecting]= useState(false);

    const handleConnectClick= async()=>{
        try{
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);
            const response = await axios.post(`http://localhost:8000/integrations/hubspot/authorize`, formData);
            const authURL = response?.data;
            const newWindow = window.open(authURL, 'Hubspot Authorization', 'width=600, height=600');

            const pollTimer = window.setInterval(()=>{
                if(newWindow?.closed !== false){
                    window.clearInterval(pollTimer);
                    handleWindowClosed();
                }
            }, 200)
        }
        catch(e){
            setIsConnecting(false);
            alert(e?.response?.data?.detail);

        }
    }
    const handleWindowClosed = async ()=>{
        try{
            const formData = new FormData();
            formData.append('user_id',user);
            formData.append('org_id', org);
            const response = await axios.post(`http://localhost:8000/integrations/hubspot/credentials`, formData);
            const credentials = response.data;
            console.log(response.data)
            if(credentials){
                setIsConnecting(false);
                setIsConnected(true);
                setIntegrationParams(prev=>({...prev, credentials:credentials, type:'Hubspot'}))
            }
            setIsConnecting(false)

        }
        catch(e){
            setIsConnecting(false);
            alert(e?.response?.data?.detail);

        }
    }

    useEffect(()=>{
        setIsConnected(integrationParams?.credentials? true: false)
    }, [])

    return(
        <>
        <Box sx= {{mt:2}}>
            Parameters
            <Box display='flex' alignItems='center' justifyContent='center' sx ={{mt:2}}>
            <Button
             variant='contained'
             onClick={isconnected ? ()=>{}: handleConnectClick}
             color={isconnected? 'success': 'primary'}
             disabled={isConnecting}
             style={{
                pointerEvents: isconnected?'none':'auto',
                cursor:isconnected?'default':'pointer',
                opacity: isconnected?1:undefined
             }}
             >
                {isconnected ? 'Hubspot Connected': isConnecting? <CircularProgress size={20}/>: 'Connect to Hubspot'}
           
            </Button>
            </Box>
        </Box>
        </>
    );
}
