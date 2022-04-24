const Web3 = require('web3')
const token_minter = require('./contracts/TokenMinter.json')
const token = require('./contracts/Token.json')

const init = async (input) => {
    const web3 = new Web3('http://127.0.0.1:9545/')
    const contract = await new web3.eth.Contract(token_minter.abi, '0x003533f4219899aEE8ea0B7B2D65f3bdc08Ea499')
    const gas_price = 542206071

    try {
        var token_address = await contract.methods.mint('0x12eaa0c1d1c084cc752bd56ba50a086c3e4cd18f', input).call()
        await contract.methods.mint('0x12eaa0c1d1c084cc752bd56ba50a086c3e4cd18f', input).send({
            from: '0x11140e8e3df64be82f57bc5974f14d56f5ebf7c3',
            gasPrice: gas_price, gas: 2310334
        })

        var token_contract = await new web3.eth.Contract(token.abi, token_address)

        //print out newly minted token's owner
        var owner = await token_contract.methods.get_current_owner().call()
        var name = await token_contract.methods.get_name().call()
        console.log('Current owner:' + owner)
        console.log('Token name: ' + name)

        //try to transfer the token
        try {
            await token_contract.methods.transfer('0xf5f75c3e26cce5ba8c36a4c67b3e37ef462f4061').send({
                from: owner,
                gasPrice: gas_price, gas: 2310334
            });
        } catch (error) {
            console.log(error)
        }

        //print out the current token's owner
        owner = await token_contract.methods.get_current_owner().call()
        name = await token_contract.methods.get_name().call()
        console.log('Current owner: ' + owner)
        console.log('Token name: ' + name)
    } catch (err) {
        console.log(err)
    }
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`Enter coin name: `, input => {
    init(input);
    readline.close();
})