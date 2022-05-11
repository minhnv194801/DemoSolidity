const express = require('express')
const app = express()
const { create } = require('ipfs-http-client')


//set the template engine ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))


//routes
app.get('/', async (req, res) => {
	res.render('tokenminter')
})

app.get('/token', async (req, res) => {
	res.render('token', {address : req.query.address})
})

//Listen on port 3000
server = app.listen(3000)


//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on("connection", (socket) => {
	console.log('New user connected')

    //listen on new_message
    socket.on("mint_token", async (data) => {
        //broadcast the new message
        var nameHash = await uploadToIpfs(data.name)
        io.sockets.emit("mint_token", {owner : data.owner, nameHash : nameHash});
    })

    socket.on("cid_to_data", async (data, callback) => {
        var returnData = await cidToData(data.cid)
        console.log(returnData)
        callback(returnData)
    })

    socket.on("error", (data) => {
        console.log(data.error)
    })
})

const uploadToIpfs = async (input) => {
    ///create an instance of the client
    const client = create('https://ipfs.infura.io:5001/api/v0')

    //push the input to ipfs
    const added = await client.add(input)
    return added.path
}

const cidToData = async (cid) => {
    //create an instance of client
    const client = create('https://ipfs.infura.io:5001/api/v0')
    const url = `https://ipfs.infura.io/ipfs/`.concat(cid)
    console.log(url)

    //get all the data from client with cid
    const datas = client.cat(cid)
    var fetchData = ''

    for await (const data of datas) {
        fetchData = fetchData.concat(data.toString())
    }

    return fetchData
}