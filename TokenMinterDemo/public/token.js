const tokenAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "newCid",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token_address",
        "type": "address"
      }
    ],
    "name": "TransferToken",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNameCid",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwnerHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "internalType": "struct Token.ownership[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

$(function () {
  const getTokenData = async (tokenAddress) => {
    var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
    var tokenOwner = await tokenContract.methods.getCurrentOwner().call()
    var tokenCid = await tokenContract.methods.getNameCid().call()
    var ownershipHistory = await tokenContract.methods.getOwnerHistory().call()

    return {
      'owner': tokenOwner,
      'cid': tokenCid,
      'history': ownershipHistory
    }
  }

  const submit = async () => {
    infoFeedback.html("<p>Please wait for the token's info to load</p>")
    let { owner, cid, history } = await getTokenData(address.val())
    socket.emit('cid_to_data', { cid: cid }, async (response) => {
      infoFeedback.html("")
      infoFeedback.append("<h1>Basic Info:</h1>")
      infoFeedback.append("<hr>")
      infoFeedback.append("<p> Token's owner: " + owner + "</p>")
      infoFeedback.append("<p> Token's name: " + response + "</p>")
      infoFeedback.append("<hr>")
      infoFeedback.append("<h1>Ownership history:</h1>")
      console.log(history)
      for (i = history.length - 1; i >= 0; i--) {
        let { time, owner } = history[i]
        time = new Date(time * 1000)
        infoFeedback.append("<hr>")
        infoFeedback.append("<p>Time stamp: " + time.toUTCString() + "</p>")
        infoFeedback.append("<p>Owner: " + owner + "</p>")
        infoFeedback.append("<hr>")
      }
    });
  }

  const transferToken = async (tokenAddress, from, to) => {
    var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)

    //building the transaction to call mint() to the tokenMinter on blockchain
    let txBuilder = await tokenContract.methods.transfer(to);
    let encodedTx = await txBuilder.encodeABI();
    let transactionObject = {
      data: encodedTx,
      from: from,
      to: tokenAddress
    };

    //call metamask to let users sign the transaction then send it
    let txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionObject],
    });

    return txHash
  }

  //ejs parameters
  var address = $("#address")
  var submitBtn = $("#submit_button")
  var infoFeedback = $("#token_info_feedback")
  var transferTokenAddress = $("#transfer_token_address")
  var newOwnerAddress = $("#address_to_transfer")
  var transferBtn = $("#transfer_button")
  var transferFeedback = $("#transfer_feedback")

  //make connection
  var socket = io.connect('http://localhost:3000')

  //check for browser metamask
  if (window.ethereum) {
    //get user's metamask account
    web3 = new Web3(window.ethereum);
    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
      account = accounts[0]
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      account = accounts[0]
    })
  } else {
    //connect to the default provider
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9b11910966d3430e9846e504d5847593"))
  }

  if (address.val() != "") {
    infoFeedback.append("<p>Please wait for the token's info to load</p>")
    submit()
  }

  //Create on click event for mintBtn
  submitBtn.click(function () {
    submit()
  })

  transferBtn.click(async () => {
    var txHash = await transferToken(transferTokenAddress.val(), account, newOwnerAddress.val())
    transferFeedback.append("<p> Transfer successful in transaction: " + txHash + "</p>")
  })
});