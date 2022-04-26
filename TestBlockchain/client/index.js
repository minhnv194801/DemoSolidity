const Web3 = require('web3')
const token_minter = require('./contracts/TokenMinter.json')
const token = require('./contracts/Token.json')

const init = async (input) => {
    // You might want to check truffle deploy address for this 
    const web3 = new Web3('http://127.0.0.1:9545/')
    /*
        The address of TokenMinter might different per machine
        Thus, you should check your TokenMinter's address after deploy it and change accordingly
    */
    const token_minter_contract = await new web3.eth
        .Contract(token_minter.abi, '0x003533f4219899aEE8ea0B7B2D65f3bdc08Ea499')
    //different blockchain have different base gas price, mine "HAVE GONE OVER 9000!!!!!"
    const gas_price = 842206336

    try {
        /*
            Method call() call the method of the contract without changing its state, 
            for some magical reason the code still run and return the new Token address when used
            this method but since the state wasn't change, the new Token will not be deployed to the blockchain
            Thus, the address of the new Token can be predicted using this method
            *cough* probably only work in localhost *cough*
            *cough* it would be pretty dumb otherwise *cough*
        */
        var token_address = await token_minter_contract.methods
            .mint('0x12eaa0c1d1c084cc752bd56ba50a086c3e4cd18f', input)
            .call()
        /*
            Calling the contract's method using web3's send will change the state of the blockchain.
            Thus, the new Token will finally be created!
        */
        await token_minter_contract.methods.mint('0x12eaa0c1d1c084cc752bd56ba50a086c3e4cd18f', input)
            .send({
                from: '0x11140e8e3df64be82f57bc5974f14d56f5ebf7c3',
                gasPrice: gas_price, gas: 2310334
            })

        //create the new Token contract using token's abi and the address we get earlier
        var token_contract = await new web3.eth.Contract(token.abi, token_address)

        //print out newly minted token's owner and name
        var owner = await token_contract.methods.get_current_owner().call()
        var name = await token_contract.methods.get_name().call()
        console.log('Current owner:' + owner)
        console.log('Token name: ' + name)

        //try to transfer the token
        try {
            await token_contract.methods
                .transfer('0xf5f75c3e26cce5ba8c36a4c67b3e37ef462f4061').send({
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