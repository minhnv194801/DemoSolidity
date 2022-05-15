import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import { create } from 'ipfs-http-client'
import MintLedger from './component/MintLedger'
import MintForm from './component/MintForm'
import MintFeedback from './component/MintFeedback'
import TokenMinter from "./contracts/TokenMinter.json"
import './App.css';

function App () {
  const [account, setAccount] = useState("")
  const [mintHistory, setMintHistory] = useState([])
  const [mintResult, setMintResult] = useState(null)
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      //get user's metamask account
      let w3 = new Web3(window.ethereum)
      setWeb3(w3)
      console.log(web3)
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        setAccount(accounts[0]);
        console.log(account)
      })
    
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      })
    } else {
      //connect to the default provider
      let w3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9b11910966d3430e9846e504d5847593"))
      setWeb3(w3)
    }
  },[])

  useEffect(() => {
    async function fetchMintHistory() {
      const tokenMinterAddress = '0x19A5A6878e66e5E12F04114ca5ef8e94919Ac9C8';
      const tokenMinterContract = await new web3.eth.Contract(TokenMinter.abi, tokenMinterAddress);
      return await tokenMinterContract.methods.getMintHistory().call();
    }
    if (web3 !== null) {
      fetchMintHistory().then(res => {setMintHistory(res)})
    }
  },[mintResult, web3])

  const uploadToIpfs = async (input) => {
    ///create an instance of the client
    const client = create('https://ipfs.infura.io:5001/api/v0')

    //push the input to ipfs
    const added = await client.add(input)
    return added.path
  }

  const handleMintToken = async(owner, name) => {
    const tokenMinterAddress = '0x19A5A6878e66e5E12F04114ca5ef8e94919Ac9C8';
    //create connection to tokenMinterContract on the blockchain using the address and abi
    const tokenMinterContract = await new web3.eth
      .Contract(TokenMinter.abi, tokenMinterAddress)

    let cid = await uploadToIpfs(name)

    try {
      //building the transaction to call mint() to the tokenMinter on blockchain
      let txBuilder = await tokenMinterContract.methods.mint(owner, cid);
      let encodedTx = await txBuilder.encodeABI();
      let transactionObject = {
        data: encodedTx,
        from: window.ethereum.selectedAddress,
        to: tokenMinterAddress
      };

      //call metamask to let users sign the transaction then send it
      let txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionObject],
      });

      setMintResult({
        txHash: txHash,
        owner: owner,
        cid: cid,
        name: name
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <h1>
        TokenMinter
      </h1>
      {account === "0xf61b13cd9b7e6cc7e3609f604232953ca8614bbc"?<MintForm onClick={handleMintToken}/>:<p>Only owner can access to mint function</p>}
      {<MintFeedback result={mintResult}/>}
      {<MintLedger mintHistory={mintHistory}/>}
    </div>
  );
}

export default App;
