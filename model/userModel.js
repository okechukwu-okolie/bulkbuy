import mongoose from "mongoose";

const appUserSchema = new mongoose.Schema({
    name:{
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
        enum:['user', 'driver', 'admin', 'super-admin'],// this limits the roles to those listed in the array
        default:'user'
    }],
    isActive:{
        type:Boolean,
        default:true
    },
    //this is the parent reference. the id defines who the parent is.
    controlledBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'AppUser',//because AppUser is called before initialisation its put in quotation mark. if the reverses is the case, the quote marks can be removed.
        default: null
    },
    subordinates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AppUser'
    }]
},
{timestamps: true}
)


const AppUser = new mongoose.model('AppUser',appUserSchema )

export default AppUser