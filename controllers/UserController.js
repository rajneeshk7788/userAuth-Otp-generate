import UserModel from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/SendEmailVerificationOnOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";

const UserRegister = async (req, res) => {
    const { name, email, phone, password, conPassword } = req.body;
    if (!name || !email || !phone || !password || !conPassword) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    if (password !== conPassword) {
        return res.status(400).json({ msg: "Password and confirm password do not match" })
    }

    if (email.length < 5 || !email.includes("@")) {
        return res.status(400).json({ message: "Please enter a valid email" })
    }

    if (phone.length < 10) {
        return res.status(400).json({ message: "Please enter a valid phone number" })
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConPassword = await bcrypt.hash(conPassword, 10);

    const user = new UserModel({
        name,
        email,
        phone,
        password: hashedPassword,
        conPassword: hashedConPassword
    })

    sendEmailVerificationOTP(req, user);

    try {
        await user.save();
        res.status(201).json({ msg: "User registered successfully" }, user)
    } catch (error) {
        res.send("User registered successfully", user);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

const emailVerification = async (req, res) => {
    const { email, otp } = req.body;
    console.log("13354>>>>>>>>>>>>>>", email, otp);
    if (!email || !otp) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const emailVerification = await EmailVerificationModel.find({ userId: user._id });
    console.log("emailVerification", emailVerification);

    if (Number(emailVerification.otp) !== Number(otp)) {
        return res.status(400).json({ message: "Invalid OTP" })
    }
    if (emailVerification.otp === otp) {
        user.isVerified = true;
        await emailVerification.save();
        return res.status(200).json({ message: "Email verified successfully" })
    }
    return res.status(400).json({ message: "Invalid dsfjkfjahfOTP" })
}


export { UserRegister, getAllUsers, emailVerification };