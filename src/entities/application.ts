import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Job } from "./job";

@Entity({name : 'job_portal_application'})
export class Application{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "datetime"})
    applyDate : Date;

    @Column({type : "varchar", length : 10})
    status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected';

    @ManyToOne(()=>User)
    user! : User;

    @ManyToOne(()=>Job)
    job! : Job;

    constructor(
        applyDate : Date,
        status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected',
        user : User,
        job : Job
    ){
        this.applyDate = applyDate;
        this.status = status;
        this.user = user;
        this.job = job
    }
}