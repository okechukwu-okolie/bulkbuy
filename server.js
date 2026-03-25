import express from 'express'


const app = express()

const port = 5003

app.listen(port, ()=>{
    console.log('Server is runnning on port:',port)
})