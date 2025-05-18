import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expire: "20m", 
    },
  },
  {
    timestamps: true,
  }
);

const EmailVerificationModel = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerificationModel; 