

export const userSchema : any = {
    email :  {
        regex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,30}$/,
        error : 'Invalid Email'
    },
    password :  {
        regex : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
        error : 'Password must contain at least eight characters, one number, one letter and special characters'
    },
    firstName :  {
        regex : /^[a-zA-Z]{2,25}$/,
        error : 'Invalid name'
    },
    lastName :  {
        regex : /^[a-zA-Z]{2,25}$/,
        error : 'Invalid name'
    },
    contactNumber1 :  {
        regex : /^[6-9]\d{9}$/,
        error : 'Invalid contact number'
    },
    address :  {
        regex : /^.{2,50}$/,
        error : 'Address required'
    },
    role :  {
        regex : /^.{2,10}$/,
        error : 'User Role required'
    },
}


export const companySchema : any = {
    name :  {
        regex : /^.{2,50}$/,
        error : 'Invalid Company Name'
    },
    description :  {
        regex : /^.{2,200}$/,
        error : 'Description Required'
    },
    industry :  {
        regex : /^.{2,30}$/,
        error : 'Industry required'
    },
    companySize :  {
        regex : /^[1-9]\d*$/,
        error : 'Invalid company size'
    },
    website :  {
        regex : /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        error : 'Invalid url'
    },
    location :  {
        regex : /^.{2,40}$/,
        error : 'Invalid Location'
    },
}


export const jobSchema : any = {
    title : {
        regex : /^.{2,50}$/,
        error : 'Invalid job title'
    },
    description : {
        regex : /^.{2,200}$/,
        error : 'Invalid description'
    },
    requiredSkills : {
        regex : /^.{2,150}$/,
        error : 'Invalid required skills'
    },
    vacancies : {
        regex : /^[0-9]\d*$/,
        error : 'Invalid vacancy number'
    },
    preferredSkills : {
        regex : /^.{2,100}$/,
        error : 'Invalid prefered skills'
    },
    employementType : {
        regex : /^.{2,15}$/,
        error : 'Invalid employment type',
        enum : ['Full Time', 'Part Time']
    },
    workMode : {
        regex : /^.{2,15}$/,
        error : 'Invalid work mode',
        enum : ['Offline' , 'Online' , 'Hybrid'] 
    },
    facilities : {
        regex : /^.{2,100}$/,
        error : 'Invalid facilities'
    },
    experienceLevel : {
        regex : /^[0-9]\d*$/,
        error : 'Invalid experience number'
    },
    workLocation : {
        regex : /^.{2,75}$/,
        error : 'Invalid work location'
    },
    isActive : {
        regex : /^(true|false)$/,
        error : 'Invalid active status'
    },
}

export const interviewScheduleSchema : any = {
    interviewType : {
        regex : /^.{2,15}$/,
        error : 'Invalid interview type',
        enum : ['Online', 'Offline']
    },
    address : {
        optional : true,
        error : 'Invalid address'
    },
    meetingUrl : {
        optional : true,
        regex : /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        error : 'Invalid url'
    },
    instructions : {
        optional : true,
        error : 'Invalid instructions'
    }
}




