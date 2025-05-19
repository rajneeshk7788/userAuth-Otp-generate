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
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: "Please provide an OTP" });
    }

    try {
        const verificationRecord = await EmailVerificationModel.findOne({ otp });
        if (!verificationRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const user = await UserModel.findById(verificationRecord.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = true;
        await user.save();
        await EmailVerificationModel.deleteMany({ userId: user._id });

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email" });
    }
};

const logIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);ss
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};


export { UserRegister, getAllUsers, emailVerification, logIn };