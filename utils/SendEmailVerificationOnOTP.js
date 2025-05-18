import dotenv from "dotenv";
import EmailVerificationModel from "../models/EmailVerification.js";
import transporter from "../config/Emailconfig.js";

dotenv.config();

const sendEmailVerificationOTP = async (req, user) => {
  try {
    if (!user || !user.email) {
      throw new Error("User or user email is missing");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP to database
    await new EmailVerificationModel({
      userId: user._id,
      otp: otp.toString(),
    }).save();

    const otpVerificationLink = `${process.env.FRONT_END_URL}/account/verify-email`;

    // Send email
    console.log("Sending email to:", user);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for registering. Please use the following OTP to verify your email:</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin: 20px 0; text-align: center;">
            <h1 style="color: #333; margin: 0;">${otp}</h1>
          </div>
          <p>Or click the button below to verify your email:</p>
          <a href="${otpVerificationLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p style="margin-top: 20px;">This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
    return otp;
  } catch (error) {
    console.error("Error sending verification email:", error);
    if (error.code === 'EAUTH') {
      throw new Error("Email authentication failed. Please check your email credentials.");
    }
    throw error;
  }
};

export default sendEmailVerificationOTP;
