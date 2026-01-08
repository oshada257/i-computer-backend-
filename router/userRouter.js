
import express from 'express'
import { createUser, loginUser } from '../controllers/userControllers.js';


const userrouter = express.Router();

userrouter.post('/register', createUser);

userrouter.post('/login', loginUser);


export default userrouter;
