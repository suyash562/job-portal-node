import { Check, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

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
    
    @Column({type : "datetime"})
    deadlineForApplying : Date;
    
    @Column({type : "varchar"})
    workLocation : string;

    @Column({type : "datetime"})
    postingDate : Date;

    @ManyToOne(() => User, (user) => user.postedJobs, {onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    employeer! : User;
    
    @ManyToMany(() => User, (user) => user.appliedJobs)
    @JoinTable()
    appliedUser! : User[];

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
    }
}