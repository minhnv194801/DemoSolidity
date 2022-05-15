import React, { useEffect, useState } from 'react'
import { create } from 'ipfs-http-client'
import Web3 from 'web3'
import Token from '../../contracts/Token.json'

function TokenInfo(props) {
    const [address, setAddress] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [transferHistory, setTransferHistory] = useState(null);

    useEffect(() => {
        console.log(props.address)
        setAddress(props.address)
    }, [props.address])

    useEffect(() => {
        if (tokenInfo !== null) {
            setTransferHistory([...tokenInfo.history].reverse().map((history) => {
                let {time, owner} = history
                time = new Date(time * 1000)
                return (
                    <div margin="10px">
                        <p>Transfer at {time.toUTCString()}</p>
                        <table border="1" cellPadding="10" align="center">
                            <tbody>
                                <tr>
                                    <td> Owner </td>
                                    <td>{owner} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }))
        }
    }, [tokenInfo])

    useEffect(() => {
        const submitInfo = async() => {
            handleOnClick()
        }

        if (address !== null && address !== "") {
            submitInfo()
        }
    }, [address])

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    }

    const handleOnClick = async () => {
        if (window.ethereum) {
            console.log("address : " + address)
            let web3 = new Web3(window.ethereum);
            var tokenContract = await new web3.eth.Contract(Token.abi, address)
            var tokenOwner = await tokenContract.methods.getCurrentOwner().call()
            var tokenCid = await tokenContract.methods.getNameCid().call()
            var tokenName = await cidToText(tokenCid)
            var ownershipHistory = await tokenContract.methods.getOwnerHistory().call()
            setTokenInfo({
                owner: tokenOwner,
                cid: tokenCid,
                name: tokenName,
                history: ownershipHistory
            })
        }
    }

    const cidToText = async (cid) => {
        //create an instance of client
        const client = create('https://ipfs.infura.io:5001/api/v0')
        const url = `https://ipfs.infura.io/ipfs/`.concat(cid)
        console.log(url)
    
        //get all the data from client with cid
        const datas = client.cat(cid)
        var fetchData = ''
    
        for await (const data of datas) {
            fetchData = fetchData.concat(String.fromCharCode.apply(String, data))
        }
    
        return fetchData
    }

    return (
        <div>
            <h1>Get Token's Info</h1>
            <div>
                <p>Token's address: <input id="address" type="text" value={props.address} onChange={handleAddressChange}/></p>
	            <p><button id="submit_button" type="button" onClick={handleOnClick}>Submit</button></p>
            </div>

            {tokenInfo?(
                <div >
                    <h1>Basic Info:</h1>
                    <table border="1" cellPadding="10" align="center"  margin="10px">
                        <tbody>
                            <tr>
                                <td> Token's owner </td>
                                <td>{tokenInfo.owner} </td>
                            </tr>
                            <tr>
                                <td> Token's name </td>
                                <td>{tokenInfo.name} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>):<p>Currently loading token's info</p>}
            {transferHistory?(<div><h1>Ownership history:</h1>{transferHistory}</div>):<></>}
        </div>
    );
}

export default TokenInfo;