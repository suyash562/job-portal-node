

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
