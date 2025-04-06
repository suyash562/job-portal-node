import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./userProfile";
import { EmployeerCompany } from "./employeerCompany";
import { Job } from "./job";
import { Application } from "./application";
import { Notification } from "./notification";

@Entity({name : 'job_portal_user'})
export class User{
    @PrimaryColumn()
    email : string;

    @Column({type : "varchar"})
    password : string;

    @Column({type : "varchar", length : 10})
    role  : 'user' | 'employeer' | 'admin';
    
    @Column({type : "bit"})
    isVerified  : boolean;

    @OneToOne(()=>UserProfile, (userProfile) => userProfile.user, {cascade : true})
    profile! : UserProfile;
    
    @OneToOne(()=>EmployeerCompany, (employeerCompany) => employeerCompany.user, {cascade : true})
    employeerCompany! : EmployeerCompany;

    @OneToMany(()=>Job, (job) => job.employeer)
    postedJobs! : Job[];

    @OneToMany(()=>Notification, (notification) => notification.user)
    notifications! : Notification[];
    
    @OneToMany(()=>Application, (application) => application.user)
    appliedJobs! : Application[];

    constructor(
        email : string,
        password : string,
        role : 'user' | 'employeer' | 'admin',
        isVerified : boolean
    ){
        this.email = email;
        this.password = password;
        this.role = role;
        this.isVerified = isVerified
    }
}