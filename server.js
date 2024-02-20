import express from 'express';
import dotenv from "dotenv"
import mongoDbConnect from './config/mongoDB.js';
import userRouter from "./router/user.route.js"
import authRouter from "./router/auth.route.js"
import errorHandler from './middlewares/errorHandler.js';

// initialization

const app = express()
dotenv.config()

// environment variables

const PORT = process.env.PORT || 9090

// set middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// static folders
app.use(express.static("public"))

// routing

app.use("/api/v1/user",userRouter)
app.use("/api/v1/auth",authRouter)

// error handlers
app.use(errorHandler)

// app listings
app.listen(PORT,()=>{
    mongoDbConnect()
    console.log(`server listening on ${PORT}`);
})