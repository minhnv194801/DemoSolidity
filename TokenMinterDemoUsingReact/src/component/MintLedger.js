import React, { useEffect, useState } from "react";

function MintLedger(props) {
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    setLedger([...props.mintHistory].reverse().map((history) => {
      let time = new Date(history.time * 1000)
      const tokenUrl = "http://localhost:3000/token?address="
      return (
        <div margin="10px">
        <p>Created at {time.toUTCString()}</p>
        <table border="1" cellPadding="10" align="center">
            <tbody>
                <tr>
                    <td> Token Address </td>
                    <td> <a href = {tokenUrl.concat(history.tokenAddress)}>{history.tokenAddress}</a> </td>
                </tr>
            </tbody>
        </table>
    </div>
      )
    }));
  },[props.mintHistory])

  return (
    <div>
      <h1>
        Ledger
      </h1>
      {props.mintHistory.length?ledger:<p>Currently loading token minter's ledger</p>}
    </div>
  );
}

export default MintLedger;
