export const resetPasswordTemplate = (resetLink: string) => {
    return (`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
            }
        </style>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        <tr>
                            <td style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px;">
                                Password Reset Request
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px; color: #333333;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">Hello,</p>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                                    We received a request to reset your password. Please click the button below to set up a new password for your account.
                                </p>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #d9534f; font-weight: bold; text-align: center;">
                                    This link is valid for 15 minutes only.
                                </p>
                                <p style="margin: 0 0 0 0; font-size: 14px; color: #777; text-align: center;">
                                    If you did not request a password reset, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                                <p style="margin: 0;">Patuakhali Science and Technology University</p>
                                <p style="margin: 5px 0 0 0;">Do not reply to this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `);
};
