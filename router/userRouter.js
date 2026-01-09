
import express from 'express'
import { createUser, loginUser, getAllUsers, toggleBlockUser } from '../controllers/userControllers.js';
import jwtmiddleware from '../lib/jwtMiddleWare.js';

const userrouter = express.Router();

userrouter.post('/register', createUser);

userrouter.post('/login', loginUser);


userrouter.get('/all', jwtmiddleware, getAllUsers);
userrouter.put('/block/:id', jwtmiddleware, toggleBlockUser);

export default userrouter;
