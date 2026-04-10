import express from 'express'
import { Database } from './config/database.js'
import dotenv from 'dotenv'
import userRoute from './route/userRoutes.js'
import cors from 'cors'
import authRoute from './route/authRoute.js'
// import { corsOptions } from './config/corsOptions.js';
dotenv.config()



const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use('/app',userRoute)
app.use('/app',authRoute)




const port = process.env.port || 5004



Database(process.env.mongo_uri).then(
    app.listen(port, ()=>{
        console.log('Server is runnning on port:',port)
    })
)
