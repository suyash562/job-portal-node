

export const otpMailTemplate = (otp : string) => {
    return `<p>OTP for your SnapHire account is </p>
            <h4>${otp}</h4>
            <p>It is valid for 3 mins. Please do not share it with anyone to ensure account security.</p>
            <h3>Snap Hire</h3>`;
}