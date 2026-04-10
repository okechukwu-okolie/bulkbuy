
import { allowedOrigins } from "./allowedOrigins.js";


//this is the procedure for laying out third party middleware
export  const corsOptions = {
    origin:(origin,callback)=>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)

        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials:true,
    optionsSuccessStatus: 200,
}