import express from 'express';
import mongoose from 'mongoose' 
import user from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import orderRouter from './router/orderRouter.js'
import auturizationMiddleware from './lib/jwtMiddleWare.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.MONGODB_URL

mongoose.connect(mongoURL).then(() => { console.log("MongoDB connected") }).catch(() => { console.log("MongoDB connection failed") })

const app = express()

app.use(express.json()) 
app.use(cors())

app.use('/images', express.static('public/images'))

app.use("/users", user)

app.use("/products", productRouter)

app.use("/orders", orderRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) })



