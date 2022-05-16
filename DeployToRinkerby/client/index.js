const Web3 = require('web3')
const token_minter = require('./contracts/TokenMinter.json')
const token = require('./contracts/Token.json')

const init = async () => {
    // You might want to check truffle deploy address for this 
    const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9b11910966d3430e9846e504d5847593"))
    const rinkerbyMainAccount = '0xF61b13Cd9b7E6CC7e3609F604232953cA8614BBc'
    const mainAccountPrivateKey = '5aced74a346a227d40738e80db6d315c713a319f7f2e7b97ce2a7646190592fa'
    const rinkerbySecondAccount = '0xF2f0F4B696A180178d1170ec89341Ef7085ebA8f'

    const token_minter_address = '0x3802A754E7b3133585f3F32296140a0AD52e884b'
    const token_minter_contract = await new web3.eth
        .Contract(token_minter.abi, token_minter_address)
        //0x5968C37968f940Ba9d093035798b573D3D5Cb5a6 (rinkerby address)
        //0x78DA770e925B0915f451EB86813922E3b453045f
        //0x003533f4219899aEE8ea0B7B2D65f3bdc08Ea499 (local address)
    
    const gas_price = 10000000000
    const gas_limit = 500000

    console.log(await token_minter_contract.methods.getMintHistory().call())
}

init()