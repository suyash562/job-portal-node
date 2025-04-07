import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./userProfile";

@Entity({name : 'job_portal_contact_number'})
export class ContactNumber{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar", unique : true, length : 10})
    number : string;

    @ManyToOne(() => UserProfile, {onDelete : 'CASCADE'})
    userProfile! : UserProfile;
  
    constructor(
        number : string,
    ){
        this.number = number
    }
}