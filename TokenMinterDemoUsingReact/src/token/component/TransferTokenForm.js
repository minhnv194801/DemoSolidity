import React, { useState } from 'react'
import Web3 from 'web3'
import Token from '../../contracts/Token.json'

function TransferTokenForm() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");
    const [transferFeedback, setTransferFeedback] = useState(null);

    const handleTokenTextFieldChange = (e) => {
        setTokenAddress(e.target.value);
    }

    const handleOwnerTextFieldChange = (e) => {
        setOwnerAddress(e.target.value);
    }

    const handleTransferToken = async () => {
        if (window.ethereum) {
            let web3 = new Web3(window.ethereum);
            var tokenContract = await new web3.eth.Contract(Token.abi, tokenAddress)
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            let account = accounts[0]

            //building the transaction to call mint() to the tokenMinter on blockchain
            let txBuilder = await tokenContract.methods.transfer(ownerAddress);
            let encodedTx = await txBuilder.encodeABI();
            let transactionObject = {
                data: encodedTx,
                from: account,
                to: tokenAddress
            };
        
            //call metamask to let users sign the transaction then send it
            let txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionObject],
            });
        
            setTransferFeedback({txHash: txHash})
        }
    }

    return (
        <div>
            <h1>Transfer Token</h1>
            <div>
                <p>Token's address: <input id="transfer_token_address" type="text" onChange={handleTokenTextFieldChange} /></p>
                <p>Address to transfer to: <input id="address_to_transfer" type="text" onChange={handleOwnerTextFieldChange}/></p>
                <p><button id="transfer_button" type="button" onClick={handleTransferToken}>Transfer</button></p>
            </div>

            {transferFeedback?<p> Transfer successful in transaction:  {transferFeedback.txHash}</p>:<></>}
        </div>
    );
}

export default TransferTokenForm;