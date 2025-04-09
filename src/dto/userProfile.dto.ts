

export class UserProfileDTO{
    firstName : string;
    lastName : string;
    address : string;
    

    constructor(
        firstName : string,
        lastName : string,
        address : string
    ){
        this.firstName = firstName ,
        this.lastName = lastName ,
        this.address = address 
    }
}