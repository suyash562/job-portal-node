import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { ContactNumber } from "./contactNumber";

@Entity({name : 'job_portal_user_profile'})
export class UserProfile{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar", length : 20})
    firstName : string;

    @Column({type : "varchar", length : 30})
    lastName : string;

    @OneToMany(()=>ContactNumber, (contactNumber) => contactNumber.userProfile, {cascade : true ,eager : true})
    contactNumbers : ContactNumber[];

    @Column({type : "varchar", length : 50})
    address : string;
    
    @Column({type : "smallint"})
    resumeCount : number;
    
    @Column({type : "smallint"})
    primaryResume : number;

    @OneToOne(()=>User, (user) => user.profile, {onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    @JoinColumn()
    user! : User;

    constructor(
        firstName : string,
        lastName : string,
        address : string,
        resumeCount : number,
        primaryResume : number,
        contactNumbers : ContactNumber[]
    ){
        this.firstName = firstName ,
        this.lastName = lastName ,
        this.address = address ,
        this.resumeCount = resumeCount, 
        this.primaryResume = primaryResume,
        this.contactNumbers = contactNumbers
    }
}