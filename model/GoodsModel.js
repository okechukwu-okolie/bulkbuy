import mongoose from 'mongoose'

const goodsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AppUser'
    },
    product:[{
        productName:String,
        productUnit: Number,
        productPrice: Number
    }],
    controlledBy:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AppUser'
    }
},
{timestamps: true}
)


const Product = new mongoose.model('Product', goodsSchema)

export default Product