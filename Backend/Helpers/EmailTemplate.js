const EmailVerificationTemplate = (verificationCode) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f7fafc; margin: 0; padding: 0;">
    <!-- Main Container -->
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <a href="#" style="color: #4f46e5; font-size: 28px; font-weight: 600; text-decoration: none;">Ephorea Ecommerce App</a>
        </div>
        
        <!-- Card -->
        <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <h1 style="color: #1a202c; font-size: 24px; margin-top: 0; margin-bottom: 24px; text-align: center;">Verify Your Email Address</h1>
            
            <p style="margin-bottom: 24px; font-size: 16px; color: #4a5568; line-height: 1.5;">
                Thank you for signing up! To complete your registration, please enter the following verification code:
            </p>
            
            <!-- Verification Code -->
            <div style="margin: 32px 0; text-align: center;">
                <div style="display: inline-block; padding: 16px 24px; background: #f0f5ff; color: #4f46e5; font-size: 28px; font-weight: 600; letter-spacing: 0.1em; border-radius: 8px; border: 1px dashed #4f46e5;">
                    ${verificationCode}
                </div>
                <div style="text-align: center; font-size: 14px; color: #718096; margin-top: 8px;">
                    This code expires in 5 minutes
                </div>
            </div>
            
            <p style="margin-bottom: 24px; font-size: 16px; color: #4a5568; line-height: 1.5;">
                If you didn't request this email, please ignore it. Someone might have entered your email by mistake.
            </p>
            
            <!-- Divider -->
            <div style="height: 1px; background: #e2e8f0; margin: 24px 0;"></div>
            
            <!-- Support Info -->
            <p style="margin-bottom: 0; font-size: 16px; color: #4a5568; line-height: 1.5;">
                Need help? <a href="mailto:support@yourbrand.com" style="color: #4f46e5; text-decoration: none;">Contact our support team</a>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px; font-size: 13px; color: #a0aec0;">
            <p style="margin: 8px 0;">© ${new Date().getFullYear()} YourBrand. All rights reserved.</p>
            <p style="margin: 8px 0;">
                <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 8px;">Privacy Policy</a> | 
                <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 8px;">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = { EmailVerificationTemplate };