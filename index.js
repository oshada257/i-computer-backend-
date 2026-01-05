import express from 'express';
import mongoose from 'mongoose' 
import user from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import auturizationMiddleware from './lib/jwtMiddleWare.js';
import cors from 'cors';

const mongoURL = "mongodb+srv://admin:2003@cluster0.vnhnwd0.mongodb.net/?appName=Cluster0"

mongoose.connect(mongoURL).then(() => { console.log("MongoDB connected") }).catch(() => { console.log("MongoDB connection failed") })

const app = express()

app.use(express.json()) 
app.use(cors())

app.use("/users", user)
app.use("/products", auturizationMiddleware, productRouter)
app.use("/products", productRouter)


app.listen(3000, () => { console.log('Server running on http://localhost:3000') })

app.post('/', (req, res) => {
    res.send('Hello World!');
});

