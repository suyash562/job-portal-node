import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import { AppDataSource } from "./config/database";
import userRouter from "./routes/userRoutes";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:4200',
    credentials : true
}));
app.use('/user',userRouter);

AppDataSource.initialize().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch(err => {
    console.log(err);
})