import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({name : 'job_portal_notification'})
export class Notification{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar"})
    message : string;

    @Column({type : 'varchar', length : 40})
    actionUrl : string;
    
    @Column({type : 'datetime'})
    generatedAt : Date;

    @Column({type : 'bit'})
    isRead : boolean;

    @ManyToOne(()=>User, (user) => user.notifications, {onDelete : 'CASCADE'})
    user! : User;

    constructor(
        message : string,
        actionUrl : string,
        user : User,
        generatedAt : Date,
        isRead : boolean
    ){
        this.message = message;
        this.actionUrl = actionUrl;
        this.user = user;
        this.generatedAt = generatedAt;
        this.isRead = isRead;
    }
}