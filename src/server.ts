import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./config/database";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user',userRouter);

AppDataSource.initialize().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch(err => {
    console.log(err);
})