import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application";

@Entity({name : 'interview_schedule_application'})
export class InterviewSchedule{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar", length : 10})
    interviewType : string;
   
    @Column({type : "datetime"})
    interviewDate : Date;

    @Column({type : "time"})
    interviewTime : Date;

    @Column({type : "varchar", length : 255})
    meetingUrl : string;
   
    @Column({type : "varchar", length : 200})
    address : string;
    
    @Column({type : "text"})
    instructions : string;

    @ManyToOne(()=>Application)
    userApplication! : Application;

    constructor(
        interviewType : string,
        interviewDate : Date,
        interviewTime : Date,
        meetingUrl : string,
        address : string,
        instructions : string
    ){
        this.interviewType = interviewType;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.meetingUrl = meetingUrl;
        this.address = address;
        this.instructions = instructions;
    }
}