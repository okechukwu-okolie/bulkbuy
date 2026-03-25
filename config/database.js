import mongoose from 'mongoose'




export const Database = async(key)=>{
    try {
        mongoose.connect(key)
        console.log('Database connected successfully')
    } catch (error) {
        console.log('ERROR CONNECTING TO THE DATABASE', error)
    }
}