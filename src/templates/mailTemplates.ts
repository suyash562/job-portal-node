

export const otpMailTemplate = (otp : string) => {
    return `<p>OTP for your SnapHire account is </p>
            <h4>${otp}</h4>
            <p>It is valid for 3 mins. Please do not share it with anyone to ensure account security.</p>
            <h3>Snap Hire</h3>`;
}

export const applicationStatusUpdatedMailTemplate = (applicationId : string, jobPost : string, appliedDate : string, status : string) => {
    return `<p>Dear Applicant, your application for job post <strong>${jobPost}</strong> applied on ${appliedDate} with application Id <strong>${applicationId}</strong> has been <strong style="color: ${status === 'Accepted' ? 'green' : 'red'};">${status}</strong> by the employeer.</p>
            <h3>Snap Hire</h3>`;
}

export const interviewScheduledMailTemplate = (jobPost : string, applicationId : string, scheduleDate : string, scheduleTime : string) => {
    return `<p>Dear Applicant, an interview has been scheduled by the employeer on <strong>${scheduleDate}</strong>, <strong>${scheduleTime}</strong> regarding your application for <strong>${jobPost}</strong> with application id <strong>${applicationId}</strong>. For more details, please log in to your account.</p>
            <h3>Snap Hire</h3>`;
}
