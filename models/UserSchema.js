import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name :{type:String,  required:true },
    email :{type:String,  required:true },
    password :{type:String,  required:true },
    phone :{type:Number,  required:true },
    // address :{type:String,  required:true },
    // isAdmin :{type:Boolean,  default:false },
    conPassword :{type:String,  required:true },
})


const UserModel=mongoose.model("user",userSchema);

export default UserModel;