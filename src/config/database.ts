import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { Job } from "../entities/job";
import { EmployeerCompany } from "../entities/employeerCompany";
import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";

export const AppDataSource = new DataSource({
    type : 'mssql',
    host : process.env.DATABASE_HOST,
    port : parseInt(process.env.DATABASE_PORT!),
    username : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASS,
    database : 'JIBE_Main_Training',
    entities : [User, UserProfile, Job, EmployeerCompany, Application, InterviewSchedule],
    synchronize : true,
    // logging : true,
    options : {
        encrypt : true,
        trustServerCertificate : true,
    },
});   
