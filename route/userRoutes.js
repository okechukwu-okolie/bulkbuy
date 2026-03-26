import express from 'express'
import {  createUser, creatingSubordinates, deleteUser, getUsers, login } from '../controllers/userController.js'
import { auth } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/authoriseMiddleware.js'


const userRoute = express.Router()


userRoute.get('/', auth,authorize('admin','super-admin'),  getUsers)
userRoute.post('/', createUser)
userRoute.post('/login', login)
userRoute.delete('/:id', deleteUser)
userRoute.post('/create-subordinate/:id', creatingSubordinates)






export default userRoute