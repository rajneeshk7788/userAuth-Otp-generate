import UserModel from "../models/UserSchema.js";
import bcrypt from "bcrypt";

const UserRegister = async(req, res) => {
    const { name, email, phone, password, conPassword } = req.body;
    if (!name || !email || !phone || !password || !conPassword) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    if (password !== conPassword){
        return res.status(400).json({msg:"Password and confirm password do not match"})
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
        password:hashedPassword,
        conPassword:hashedConPassword
    })
    try {
        await user.save();
        res.status(201).json({msg:"User registered successfully"}, user )
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


export { UserRegister, getAllUsers };