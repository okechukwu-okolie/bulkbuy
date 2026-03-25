import express from 'express'
import {  createUser, creatingSubordinates, getUsers } from '../controllers/userController.js'


const userRoute = express.Router()


userRoute.get('/', getUsers)
userRoute.post('/', createUser)
userRoute.post('/create-subordinate/:id', creatingSubordinates)






export default userRoute