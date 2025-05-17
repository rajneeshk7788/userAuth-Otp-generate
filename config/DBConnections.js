
import mongoose from "mongoose";

const connectDB = async (DB_URL) => {
    try {
        const dbOptions = {
            dbName: "userRgister"
        };
        await mongoose.connect(DB_URL, dbOptions);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

export default connectDB;