import { NextFunction, Request, Response } from "express";
import { GlobalError } from "../types/types";
import { companySchema, userSchema } from "./validationSchema";
import { EmployeerCompany } from "../entities/employeerCompany";


export const validateUserData = (req : Request, res : Response, next : NextFunction) => {

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
            if(
                (userSchema[key].regex && !userSchema[key].regex.test(user[key])) || 
                user[key] === '' || 
                user[key] === undefined
            ){
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


export const validate = (keys : string[], schema : any, dataType : string) => {
     
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            const data : any = req.body[dataType]; 
           
            if(!data){
                throw new GlobalError(400, 'Invalid data');
            }

            for (let key of keys) {
                if(schema[key].optional){
                    if(data[key] === '' || data[key] === undefined || data[key] === null){
                        continue;
                    }
                }
                if( (schema[key].regex && !schema[key].regex.test(data[key])) || data[key] === '' || data[key] === undefined ){
                    next(new GlobalError(400, schema[key].error));
                }
                if(schema[key].enum && !schema[key].enum.includes(data[key])){
                    next(new GlobalError(400, schema[key].error));
                }
            }
            next();
        }
        catch(err){
            next(err);
        }
    }
}


export const validateContactNumbers = (schema : any, dataType : string) => {
    
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            const data : any = req.body[dataType]; 
            
            if(!data.contactNumbers[0]){
                throw new GlobalError(400, schema['contactNumber1'].error);
            }
            for(let i = 0; i < 2; i++){
                if(data.contactNumbers[i] && !schema['contactNumber1'].regex.test(data.contactNumbers[i].number)){
                    throw new GlobalError(400, schema['contactNumber1'].error);
                }
            }
            next();
        }
        catch(err){
            next(err)
        }
    }
}


export const validateDate = (dataType : string, validationVariableName : string) => {
    
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            const data : any = req.body[dataType][validationVariableName]; 
            
            if(!data){
                throw new GlobalError(400, 'Invalid Date');
            }
            
            if(Date.parse(data)){
                next();
            }
            else{
                throw new GlobalError(400, 'Invalid date');
            }
        }
        catch(err){
            next(err)
        }
    }
}


export const validateTime = (dataType : string, validationVariableName : string) => {
    
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            const data : any = req.body[dataType][validationVariableName]; 
            
            if(!data){
                throw new GlobalError(400, 'Invalid time');
            }
            
            const hours = parseInt(data.split(':')[0]);
            const mins = parseInt(data.split(':')[1]);
            
            if(Number.isInteger(hours) && Number.isInteger(mins) && hours >= 0 && hours <= 24 && mins >= 0 && mins <= 60){
                next();
            }
            else{
                throw new GlobalError(400, 'Invalid time');
            }
        }
        catch(err){
            next(err)
        }
    }
}


export const validateSalaryRange = (dataType : string, validationVariableName : string) => {
    
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            const data : any = req.body[dataType][validationVariableName]; 
            
            if(!data){
                throw new GlobalError(400, 'Invalid salary range');
            }
            
            const salaryRangeFrom = parseInt(data.split(' ')[0]);
            const salaryRangeTo = parseInt(data.split(' ')[1]);
            
            if(typeof salaryRangeFrom === 'number' && typeof salaryRangeTo === 'number' && salaryRangeFrom < salaryRangeTo){
                next();
            }
            else{
                throw new GlobalError(400, 'Invalid salary range');
            }
        }
        catch(err){
            next(err)
        }
    }
}
