import express from 'express'
import { Database } from './config/database.js'
import dotenv from 'dotenv'
import userRoute from './route/userRoutes.js'
import cors from 'cors'
dotenv.config()



const app = express()

app.use(express.json())
app.use('/app',userRoute)
app.use(cors())




const port = process.env.port || 5004



Database(process.env.mongo_uri).then(
    app.listen(port, ()=>{
        console.log('Server is runnning on port:',port)
    })
)
