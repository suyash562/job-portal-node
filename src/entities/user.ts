import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./userProfile";

@Entity({name : 'job_portal_user'})
export class User{
    @PrimaryColumn()
    email : string;

    @Column({type : "varchar"})
    password : string;

    @Column({type : "varchar", length : 10})
    role  : 'user' | 'employeer' | 'admin';

    @OneToOne(()=>UserProfile, (userProfile) => userProfile.user, {cascade : true})
    profile! : UserProfile;

    constructor(
        email : string,
        password : string,
        role : 'user' | 'employeer' | 'admin'
    ){
        this.email = email;
        this.password = password;
        this.role = role;
    }
}