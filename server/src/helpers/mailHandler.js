
const defaultEmail = 'MS_T113Tc@trial-pq3enl6wpv742vwr.mlsender.net';

export function createOTPMessage(email, otp) {
    const message = {
        from: defaultEmail,
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

export function createSuccessMesage(email, referenceCode) {
    const message = {
        from: defaultEmail,
        to: email,
        subject: 'Thank you for booking with Appointify',
        text: `Your Reference Code is ${referenceCode}. This code is valid for 10 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Your One-Time Pin (OTP)</h2>
            <p style="color: #555;">Dear user,</p>
            <p style="color: #555;">Thank you for booking your appointment with us. Please have the copy of your reference code. You can use this to track your appointment status.:</p>
            <p style="color: #555;">Please check your email from time to time for any updates regarding your appointment.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px;">${referenceCode}</span>
            </div>
    
            <p style="color: #555;">This reference code is only valid to this platform. If you did not request this code, please ignore this email or contact support.</p>
    
            <p style="color: #555;">Thank you,<br />The Support Team</p>
    
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>&copy; 2024 Appointify. All rights reserved.</p>
            </footer>
        </div>
        `
    };

    return message;
}

export function createApproveMessage(email) {
    const message = {
        from: defaultEmail,
        to: email,
        subject: 'Appointment Approved',
        text: `Your appointment has been successfully approved.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Your Appointment Has Been Approved</h2>
            <p style="color: #555;">We are pleased to inform you that your appointment has been approved.</p>
            <p style="color: #555;">Thank you for using Appointify! We look forward to serving you.</p>
            
            <p style="color: #555;">Best regards,<br />The Appointify Team</p>
    
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>&copy; 2024 Appointify. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </footer>
        </div>
        `
    };
    
    return message;
}

export function createDeclineMessage(email, cancelReason) {
    const message = {
        from: defaultEmail,
        to: email,
        subject: 'Appointment Approved',
        text: `Your appointment has been declined.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Your Appointment Has Been Cancelled</h2>
            <p style="color: #555;">We regret to inform you that your appointment has been declined due to the following reason: ${cancelReason}.</p>
            <p style="color: #555;">Thank you for using Appointify! We look forward to serving you.</p>
            
            <p style="color: #555;">Best regards,<br />The Appointify Team</p>
    
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>&copy; 2024 Appointify. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </footer>
        </div>
        `
    };
    
    return message;
}