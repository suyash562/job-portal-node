import { Check, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Application } from "./application";

@Entity({name : 'job_portal_job'})
export class Job{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar"})
    title : string;
    
    @Column({type : "varchar"})
    description : string;

    @Column({type : "varchar"})
    requiredSkills : string;

    @Column({type : "int"})
    vacancies : number;

    @Column({type : "varchar"})
    preferredSkills : string;

    @Column({type : "varchar"})
    @Check("employementType in ('Full Time', 'Part Time')")
    employementType : "Full Time" | "Part Time";
    
    @Column({type : "varchar"})
    @Check("workMode in ('Offline', 'Online', 'Hybrid')")
    workMode : 'Offline' | 'Online' | 'Hybrid';
    
    @Column({type : "varchar"})
    salaryRange : string; 
    
    @Column({type : "varchar"})
    facilities : string;
    
    @Column({type : "int"})
    experienceLevel : string;
    
    @Column({type : "date"})
    deadlineForApplying : Date;
    
    @Column({type : "varchar"})
    workLocation : string;

    @Column({type : "date"})
    postingDate : Date;

    @Column({type : "bit"})
    isActive! : boolean;

    @ManyToOne(() => User, (user) => user.postedJobs, {onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    employeer! : User;
    
    @OneToMany(() => Application, (application) => application.job)
    userAppliedForJob! : Application[];

    constructor(
        title : string,
        description : string,
        requiredSkills : string,
        vacancies : number,
        preferredSkills : string,
        employementType : "Full Time" | "Part Time",
        workMode : 'Offline' | 'Online' | 'Hybrid',
        salaryRange : string,
        facilities : string,
        experienceLevel : string,
        deadlineForApplying : Date,
        workLocation : string,
        postingDate : Date,
        isActive : boolean
    ){
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.vacancies = vacancies;
        this.preferredSkills = preferredSkills;
        this.employementType = employementType;
        this.workMode = workMode;
        this.salaryRange = salaryRange;
        this.facilities = facilities;
        this.experienceLevel = experienceLevel;
        this.deadlineForApplying = deadlineForApplying;
        this.workLocation = workLocation;
        this.postingDate = postingDate;
        this.isActive = isActive;
    }
}