import { NextFunction, Request, Response } from "express";
import { UserProfile } from "../entities/userProfile";
import { User } from "../entities/user";
import { GlobalError } from "../types/types";
import { companySchema, userSchema } from "./validationSchema";
import { EmployeerCompany } from "../entities/employeerCompany";


export const validateUser = (req : Request, res : Response, next : NextFunction) => {

    try{
        
        const user : any = req.body; 
        const keys : string[] = [
            'email',
            'password',
            'firstName',
            'lastName',
            'contactNumber1',
            'address',
            'role'
        ];
        
        for (let key of keys) {
            if((userSchema[key].regex && !userSchema[key].regex.test(user[key])) || user[key] === '' || user[key] === undefined){
                throw new GlobalError(400, userSchema[key].error);
            }
        }

        if(user.contactNumber2 != ''){
            if(!userSchema['contactNumber1'].regex.test(user['contactNumber2'])){
                throw new GlobalError(400, userSchema['contactNumber1'].error);
            }
        }

        if(user.role != 'user' && user.role != 'employeer'){
            throw new GlobalError(400, 'Invalid user role');
        }

        if(user.role === 'employeer'){
            validateEmployerCompany(req, res, next);
        }

        next();
    }
    catch(err){
        next(err);
    }
}



export const validateEmployerCompany = (req : Request, res : Response, next : NextFunction) => {

    const company : EmployeerCompany = req.body; 
    const keys : (keyof (EmployeerCompany))[] = [
        'name',
        'description',
        'industry',
        'companySize',
        'website',
        'location'
    ];
    
    for (let key of keys) {
        if( (companySchema[key].regex && !companySchema[key].regex.test(company[key])) || company[key] === '' || company[key] === undefined ){
            next(new GlobalError(400, companySchema[key].error));
        }
    }
}
