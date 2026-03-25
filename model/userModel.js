import mongoose from "mongoose";

const appUserSchema = new mongoose.Schema({
    username:{
       type: String,
       trim: true,
       required: true
    },
     email:{
       type: String,
       trim: true,
       required: true
    },
     password:{
       type: String,
       required: true
    },
    roles:[{
        type: String,
        default:'Buyer' // Admin , Super-Admin
    }],
    active:{
        type:Boolean,
        default:true
    },
    //this is the parent reference
    controlledBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'AppUser',//because AppUser is called before initialisation its put in quotation mark. if the reverses is the case, the quote marks can be removed.
        default: null
    }
},
{timestamps: true}
)


const AppUser = new mongoose.model('AppUser',appUserSchema )

export default AppUser