

export const userSchema : any = {
    email :  {
        regex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        error : 'Invalid Email'
    },
    password :  {
        regex : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        error : 'Password must contain at least eight characters, one number, one letter and special characters'
    },
    firstName :  {
        regex : /^[a-zA-Z]{2,}$/,
        error : 'Invalid name'
    },
    lastName :  {
        regex : /^[a-zA-Z]{2,}$/,
        error : 'Invalid name'
    },
    contactNumber1 :  {
        regex : /^[6-9]\d{9}$/,
        error : 'Invalid phone number'
    },
    address :  {
        error : 'Address required'
    },
    role :  {
        error : 'User Role required'
    },
}


export const companySchema : any = {
    name :  {
        error : 'Invalid Company Name'
    },
    description :  {
        error : 'Description Required'
    },
    industry :  {
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
        error : 'Invalid Location'
    },
}


export const jobSchema : any = {
    title : {
        error : 'Invalid job title'
    },
    description : {
        error : 'Invalid description'
    },
    requiredSkills : {
        error : 'Invalid required skills'
    },
    vacancies : {
        regex : /^[0-9]\d*$/,
        error : 'Invalid vacancy number'
    },
    preferredSkills : {
        error : 'Invalid prefered skills'
    },
    employementType : {
        error : 'Invalid employment type',
        enum : ['Full Time', 'Part Time']
    },
    workMode : {
        error : 'Invalid work mode',
        enum : ['Offline' , 'Online' , 'Hybrid'] 
    },
    facilities : {
        error : 'Invalid facilities'
    },
    experienceLevel : {
        regex : /^[0-9]\d*$/,
        error : 'Invalid experience number'
    },
    workLocation : {
        error : 'Invalid work location'
    },
    isActive : {
        regex : /^(true|false)$/,
        error : 'Invalid active status'
    },
    
}

export const interviewScheduleSchema : any = {
    interviewType : {
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




