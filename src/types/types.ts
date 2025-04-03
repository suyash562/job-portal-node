

export class RequestResult{
    statusCode! : number;
    message! : string;
    value : any

    constructor(
        statusCode : number,
        message : string,
        value : any
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.value = value
    }
}


export class GlobalError extends Error{
    statusCode : number;
    
    constructor(statusCode : number, message : string){
        super(message);
        this.statusCode = statusCode;
    }
}