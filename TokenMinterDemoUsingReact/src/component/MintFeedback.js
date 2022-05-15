import React from 'react';

function MintFeedback(props) {
    if (props.result !== null) {
        return (
            <div id="mintFeedback">
                <h1>Mint Result</h1>
                    <hr></hr>
                    <p>Token's created in transaction: {props.result.txHash} </p>
                    <p>Token's owner: {props.result.owner} </p>
                    <p>Token's cid: {props.result.cid} </p>
                    <p>Token's name: {props.result.name} </p>
                    <hr></hr>
            </div>
        );
    }
}

export default MintFeedback;