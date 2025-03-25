import { Check, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'job_portal_employee_company'})
export class EmployeerCompany{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type : "varchar", length : 50})
    name : string;

    @Column({type : "varchar", length : 50})
    description : string;

    @Column({type : "varchar", length : 30})
    industry : string;

    @Column({type : "int"})
    @Check("companySize > 0")
    companySize : number; 

    @Column({type : "varchar"})
    website : string;

    @Column({type : "varchar"})
    location : string;
    
    @Column({type : "int"})
    averageRating : number;

    constructor(
        name : string,
        description : string,
        industry : string,
        companySize : number,
        website : string,
        location : string,
        averageRating : number,
    ){
        this.name = name;
        this.description = description;
        this.industry = industry;
        this.companySize = companySize; 
        this.website = website;
        this.location = location;
        this.averageRating = averageRating;
    }
}