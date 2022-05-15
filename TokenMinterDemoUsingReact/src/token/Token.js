import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TokenInfo from "./component/TokenInfo";
import TransferTokenForm from "./component/TransferTokenForm";
import '../App.css';

function Token() {
    const [address, setAddress] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
        setAddress(searchParams.get("address"))
    }, [])

    return (
        <div className="Token">
            <h1>Token</h1>

            <div style={{float:"left", width:"40%", margin:"5%", marginTop:"0%"}}>
                <TokenInfo address={address}/>
            </div>

            <div style={{float:"right", width:"40%", margin:"5%", marginTop:"0%"}}>
                <TransferTokenForm />
            </div>
        </div>
    )
}

export default Token