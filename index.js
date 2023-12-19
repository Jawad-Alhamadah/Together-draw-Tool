const express = require('express')
const cors = require('cors')

const app = express()

const port = 7000

app.use(cors())

app.get('/home', (request,response) =>{
    
    response.status(200).json([
        {
            'id':"1",
            "name":"johnjnn",
            "order":"burgerssss"
        },
        {
            'id':"2",
            "name":"sam",
            "order":"noodles"
        },
        {
            'id':"3",
            "name":"eric",
            "order":"pancakes"
        }
    ])
})

app.listen(port, ()=>{
    console.log("listening on " + port)
})


