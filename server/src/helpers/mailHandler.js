export function createOTPMessage(email, otp) {
    const message = {
        from: 'info@shirazaki.site',
        to: email,
        subject: 'Your One-Time Pin (OTP) for Verification',
        text: 'Your OTP is ${genCode}. This code is valid for 10 minutes.',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Your One-Time Pin (OTP)</h2>
            <p style="color: #555;">Dear user,</p>
            <p style="color: #555;">We have received a request to verify your identity. Please use the following One-Time Pin (OTP) to complete the verification process:</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px;">${otp}</span>
            </div>
    
            <p style="color: #555;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email or contact support.</p>
    
            <p style="color: #555;">Thank you,<br />The Support Team</p>
    
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
        `
    };

    return message;
}