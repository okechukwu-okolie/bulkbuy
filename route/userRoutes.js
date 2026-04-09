import express from 'express'
import {  createUser, deleteUser, getOne, getUsers } from '../controllers/userController.js'
// import { auth } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/authoriseMiddleware.js'


const userRoute = express.Router()


userRoute.get('/',  getUsers)
userRoute.get('/:id',  getOne)
userRoute.post('/create-user', createUser)
// userRoute.post('/login', login)
userRoute.delete('/:id', deleteUser)
// userRoute.post('/create-subordinate/:id', creatingSubordinates)






export default userRoute