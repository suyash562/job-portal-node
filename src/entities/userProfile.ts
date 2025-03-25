import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({name : 'job_portal_user_profile'})
export class UserProfile{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar", length : 20})
    firstName : string;

    @Column({type : "varchar", length : 30})
    lastName : string;

    @Column({type : "varchar", unique : true})
    phoneNumber : string;

    @Column({type : "varchar", length : 50})
    address : string;
    
    @Column({type : "varchar", length : 20})
    resume : string | null;

    @OneToOne(()=>User, (user) => user.profile, {onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    @JoinColumn()
    user! : User;

    constructor(
        firstName : string,
        lastName : string,
        phoneNumbers : string,
        address : string,
        resume : string | null
    ){
        this.firstName = firstName ,
        this.lastName = lastName ,
        this.phoneNumber = phoneNumbers ,
        this.address = address ,
        this.resume = resume 
    }
}