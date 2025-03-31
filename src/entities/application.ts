import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Job } from "./job";
import { InterviewSchedule } from "./interviewSchedule";

@Entity({name : 'job_portal_application'})
export class Application{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "datetime"})
    applyDate : Date;

    @Column({type : "varchar", length : 10})
    status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected';

    @Column({type : "bit"})
    isActive : boolean;

    @ManyToOne(()=>User)
    user! : User;

    @ManyToOne(()=>Job)
    job! : Job;

    @OneToMany(() => InterviewSchedule, (interviewSchedule) => interviewSchedule.userApplication)
    interviews! : InterviewSchedule[];

    constructor(
        applyDate : Date,
        status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected',
        user : User,
        job : Job,
        isActive : boolean
    ){
        this.applyDate = applyDate;
        this.status = status;
        this.user = user;
        this.job = job;
        this.isActive = isActive;
    }
}