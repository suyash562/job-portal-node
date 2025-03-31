import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { Job } from "../entities/job";
import { EmployeerCompany } from "../entities/employeerCompany";
import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";

export const AppDataSource = new DataSource({
    type : 'mssql',
    host : 'dev.c5owyuw64shd.ap-south-1.rds.amazonaws.com',
    port : 1982,
    username : 'j2',
    password : '123456',
    database : 'JIBE_Main_Training',
    entities : [User, UserProfile, Job, EmployeerCompany, Application, InterviewSchedule],
    synchronize : true,
    // logging : true,
    options : {
        encrypt : true,
        trustServerCertificate : true,
    },
});   
