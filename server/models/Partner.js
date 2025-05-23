import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },

  isVerified: { type: Boolean, default: false }, // ✅ email verified during registration
  verified: { type: Boolean, default: false },   // ✅ phone verified via OTP during login
  isApproved: { type: Boolean, default: false }, // ✅ admin approval status
  isDeclined: { type: Boolean, default: false }, // ❌ for declined partners
  verificationStatus: { type: String, enum: ['pending', 'verified', 'declined'], default: 'pending',},   //for the after documents submitted verification
  isDocumentsSubmitted: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { 
    type: Date,
    default: Date.now,
  },
  jobId: { type: String, unique: true },
  
});

// ✅ Check if model already exists before defining
const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
export default Partner;
