import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'job_portal_application'})
export class Application{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "datetime"})
    applyDate : Date;

    @Column({type : "varchar", length : 10})
    status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected';

    constructor(
        applyDate : Date,
        status : 'Pending' | 'Interview' | 'Accepted' | 'Rejected'
    ){
        this.applyDate = applyDate;
        this.status = status;
    }
}