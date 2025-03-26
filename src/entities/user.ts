import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./userProfile";
import { EmployeerCompany } from "./employeerCompany";
import { Job } from "./job";

@Entity({name : 'job_portal_user'})
export class User{
    @PrimaryColumn()
    email : string;

    @Column({type : "varchar"})
    password : string;

    @Column({type : "varchar", length : 10})
    role  : 'user' | 'employeer' | 'admin';

    @OneToOne(()=>UserProfile, (userProfile) => userProfile.user, {cascade : true})
    profile! : UserProfile;
    
    @OneToOne(()=>EmployeerCompany, (employeerCompany) => employeerCompany.user, {cascade : true})
    employeerCompany! : EmployeerCompany;

    @OneToMany(()=>Job, (job) => job.employeer)
    postedJobs! : Job[];
    
    @ManyToMany(()=>Job, (job) => job.appliedUser)
    appliedJobs! : Job[];

    constructor(
        email : string,
        password : string,
        role : 'user' | 'employeer' | 'admin'
    ){
        this.email = email;
        this.password = password;
        this.role = role;
    }
}