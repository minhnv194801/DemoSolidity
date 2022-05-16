const Web3 = require('web3')
const token = require('./contracts/Token.json')

const init = async (input) => {
    // You might want to check truffle deploy address for this 
    const web3 = new Web3("https://rinkeby.infura.io/v3/9b11910966d3430e9846e504d5847593")
    const rinkerbyMainAccount = '0xF61b13Cd9b7E6CC7e3609F604232953cA8614BBc'
    const mainAccountPrivateKey = '5aced74a346a227d40738e80db6d315c713a319f7f2e7b97ce2a7646190592fa'
    const rinkerbySecondAccount = '0xF2f0F4B696A180178d1170ec89341Ef7085ebA8f'

    const gas_price = 10000000000
    const gas_limit = 3000000

    var token_address = '0xe651bC4b8B88fe5a8bF0Bcb75F5aC09cB2b4b619'

    var token_contract = await new web3.eth.Contract(token.abi, token_address)

    //print out newly minted token's owner and name
    var owner = await token_contract.methods.get_current_owner().call()
    var name = await token_contract.methods.get_name().call()
    console.log('Current owner:' + owner)
    console.log('Token name: ' + name)

    try {
        let tx_builder = await token_contract.methods.transfer(rinkerbySecondAccount);
        let encoded_tx = await tx_builder.encodeABI();
        let transactionObject = {
            gas: gas_limit,
            data: encoded_tx,
            from: rinkerbyMainAccount,
            to: token_address
        };

        var signedTx = await web3.eth.accounts.signTransaction(transactionObject, mainAccountPrivateKey)
        var receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    } catch (error) {
        console.log(error)
    }

    //print out the current token's owner
    owner = await token_contract.methods.get_current_owner().call()
    name = await token_contract.methods.get_name().call()
    console.log('Current owner: ' + owner)
    console.log('Token name: ' + name)

}

init()