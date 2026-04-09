import AppUser from "../model/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


//GET ONE USER
export const getOne =async(req,res)=>{
  const {id} = req.params
  try {
    const user = await AppUser.findById(id)
    if(!user) return res.status(404).json({message:'user not found'})
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:'server error'})
  }
}

//GET ALL USERS

export const getUsers =async(req,res)=>{
  try {
    const users = await AppUser.find().select('-password')
    console.log(users)
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message:'server error'})
  }
}



//CREATE USER
export const createUser =async(req,res)=>{

  const {username,email,password,roles, isActive} = req.body

  try {
    const existingUser = await AppUser.findOne({email})
    if(existingUser) return res.status(400).json({message:'user already exists'})
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new AppUser({
      name: username,
      email,
      password: hashedPassword,
      roles,
      isActive
    })
    await user.save()
    res.status(201).json({message:'user created successfully'})
  } catch (error) {
    res.status(500).json({message:'server error'})
  }

}


//delete user
export const deleteUser =async(req,res)=>{
  const {id} = req.params
  try {
    
    const user = await AppUser.findById(id)
    if(!user) return res.status(404).json({message:'user not found'})
    await user.deleteOne()
    res.status(200).json({message:'user deleted successfully'})
  } catch (error) {
    res.status(500).json({message:'server error'})
  }
}

