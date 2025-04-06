import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";

@Entity({name : 'job_portal_notification'})
export class Notification{
    @PrimaryColumn()
    id! : number;

    @Column({type : "varchar"})
    message : string;

    @ManyToOne(()=>User, (user) => user.notifications, {onDelete : 'CASCADE'})
    user! : User;
    
    constructor(
        message : string
    ){
        this.message = message;
    }
}