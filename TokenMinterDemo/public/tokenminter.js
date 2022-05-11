const tokenMinterAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "CreateToken",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenCid",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "address",
        "name": "newTokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwnTokenAdress",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMintHistory",
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
            "name": "tokenAddress",
            "type": "address"
          }
        ],
        "internalType": "struct TokenMinter.mintResult[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

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

const tokenMinterAddress = '0x19A5A6878e66e5E12F04114ca5ef8e94919Ac9C8'

$(function () {
  const mintToken = async (tokenOwner, tokenNameHash) => {
    //create connection to tokenMinterContract on the blockchain using the address and abi
    const tokenMinterContract = await new web3.eth
      .Contract(tokenMinterAbi, tokenMinterAddress)

    try {
      //call the mint method of tokenMinter to get the new token's address
      let tokenAddress = await tokenMinterContract.methods
        .mint(tokenOwner, tokenNameHash)
        .call()

      //building the transaction to call mint() to the tokenMinter on blockchain
      let txBuilder = await tokenMinterContract.methods.mint(tokenOwner, tokenNameHash);
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

      //create connection to the newly created token
      const tokenContract = await new web3.eth
        .Contract(tokenAbi, tokenAddress)

      return {
        'contract': tokenContract,
        'transaction': txHash
      }
    } catch (err) {
      console.log(err)
    }
  }

  const reloadLedger = async () => {
    const tokenUrl = "http://localhost:3000/token?address="
    ledger.html("")
    ledger.append("<p>Currently loading token minter's ledger</p>")
    const tokenMinterContract = await new web3.eth
      .Contract(tokenMinterAbi, tokenMinterAddress)
    var minterLedger = await tokenMinterContract.methods.getMintHistory().call()
    console.log(minterLedger)
    ledger.html("")
    for (i = minterLedger.length - 1; i >= 0; i--) {
      let { time, tokenAddress } = minterLedger[i]
      time = new Date(time * 1000)
      ledger.append("<hr>")
      ledger.append("<p>Time stamp: " + time.toUTCString() + "</p>")
      ledger.append("<p>Address: " + "<a href=" + tokenUrl.concat(tokenAddress) + ">" + tokenAddress + "</a> </p>")
      ledger.append("<hr>")
    }
  }

  const reloadMinter = function (account) {
    minter.html('')
    if (account == '0xf61b13cd9b7e6cc7e3609f604232953ca8614bbc') {
      minter.append("<div>")
      minter.append("<p>Token's owner: <input id=\"owner\" type=\"text\" /></p>")
      minter.append("<p>Token's name: <input id=\"name\" type=\"text\" /> </p>")
      minter.append("<p><button id=\"mint_token\" type=\"button\">Mint</button></p>")
      minter.append("</div>")
      var owner = $("#owner")
      var name = $("#name")
      var mintBtn = $("#mint_token")

      //Create on click event for mintBtn
      mintBtn.click(function () {
        //send user's input data to server for processing
        socket.emit('mint_token', { owner: owner.val(), name: name.val() })
      })
    }
  }

  //make connection
  var socket = io.connect('http://localhost:3000')

  //check for browser metamask
  if (window.ethereum) {
    //get user's metamask account
    web3 = new Web3(window.ethereum);
    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
      account = accounts[0]
      console.log(account)
      reloadMinter(account)
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      feedback.html("")
      account = accounts[0]
      console.log(account)
      reloadMinter(account)
    })
  } else {
    //connect to the default provider
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9b11910966d3430e9846e504d5847593"))
  }

  //ejs parameters
  var minter = $("#minter")
  var feedback = $("#feedback")
  var ledger = $("#ledger")

  reloadLedger()

  //Listen on mint_token event to receive processed data from server
  socket.on("mint_token", async (data) => {
    feedback.html("")
    var { contract, transaction } = await mintToken(data.owner, data.nameHash)
    socket.emit('cid_to_data', { cid: data.nameHash }, (response) => {
      feedback.append("<h1>Mint Result</h1>")
      feedback.append("<hr>")
      feedback.append("<p> Token's created in transaction: " + transaction + "</p>")
      feedback.append("<p> Token's owner: " + data.owner.toString() + "</p>")
      feedback.append("<p> Token's cid: " + data.nameHash.toString() + "</p>")
      feedback.append("<p> Token's name: " + response + "</p>")
      feedback.append("<hr>")
      reloadLedger()
    });
  })
});