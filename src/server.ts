import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import { AppDataSource } from "./config/database";
import userRouter from "./routes/userRoutes";
import cookieParser from 'cookie-parser';
import jobRouter from "./routes/jobRoutes";
import applicationRouter from "./routes/applicationRoutes";
import interviewScheduleRouter from "./routes/interviewScheduleRouter";


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
app.use('/job',jobRouter);
app.use('/application',applicationRouter);
app.use('/interview',interviewScheduleRouter);

AppDataSource.initialize().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch(err => {
    console.log(err);
})
