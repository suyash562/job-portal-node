

export class EmployeerCompanyDTO{
    name : string;
    description : string;
    industry : string;
    companySize : number; 
    website : string;
    location : string;

    constructor(
        name : string,
        description : string,
        industry : string,
        companySize : number,
        website : string,
        location : string
    ){
        this.name = name;
        this.description = description;
        this.industry = industry;
        this.companySize = companySize; 
        this.website = website;
        this.location = location;
    }
}