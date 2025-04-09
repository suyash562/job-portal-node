

export class UserDTO{
    email : string;
    password : string;
    role  : 'user' | 'employeer'

    constructor(
        email : string,
        password : string,
        role : 'user' | 'employeer'
    ){
        this.email = email;
        this.password = password;
        this.role = role
    }
}