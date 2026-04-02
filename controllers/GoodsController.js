import Product from "../model/GoodsModel.js";





export const createUserProduct = async(req, res)=>{
    const {user, product, controlledBy} = req.body

    if(!user || !product || !controlledBy) return res.status(400).json({message:'input valid users and admins to proceed'})

    const productRequest = new Product({
        
    })
}