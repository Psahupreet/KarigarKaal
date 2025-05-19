import Partner from '../models/Partner.js';
// import { PartnerDocument } from '../models/partnerDocumentsModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Order from "../models/Order.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};
//registration partner
export const registerPartner = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingPartner = await Partner.findOne({ $or: [{ email }, { phone }] });
    if (existingPartner) return res.status(400).json({ message: 'Email or Phone already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const jobId = crypto.randomBytes(4).toString('hex');

    const partner = new Partner({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires,
      jobId,
    });

    await partner.save();
    await sendEmail(email, otp);

    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};
//verify otp pertner email signup
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const partner = await Partner.findOne({ email });
    if (!partner) return res.status(400).json({ message: 'Partner not found' });

    if (partner.otp !== otp || partner.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    partner.isVerified = true;
    partner.otp = undefined;
    partner.otpExpires = undefined;
    await partner.save();

    res.json({ message: 'Partner verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Step 1: Send OTP to Email for Login
export const sendLoginOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const partner = await Partner.findOne({ email });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found. Please register first." });
    }
    if (!partner.isVerified) {
      return res.status(403).json({
        message: "We got your details. We will contact you soon or one of our team members will call you.",
      });
    }
    const otp = generateOTP();
    partner.otp = otp;
    partner.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await partner.save();

    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email for login." });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// Step 2: Verify OTP and Login
export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const partner = await Partner.findOne({ email });

    if (!partner) return res.status(404).json({ message: "Partner not found" });

    // Check if approved by admin
    if (!partner.isApproved) {
      return res.status(403).json({
        message: "We got your details. We will contact you soon or one of our team members will call you.",
      });
    }


    if (!partner || partner.otp !== otp || partner.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    partner.otp = null;
    partner.otpExpires = null;
    await partner.save();

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("partner_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", token, partner });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


//get all partners
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch partners" });
  }
};


//delete partner
export const deletePartner = async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: "Partner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

//get partner dashboard status
export const getPartnerDashboardStats = async (req, res) => {
  try {
    const partnerId = req.partner._id; // Assuming req.partner is populated via auth middleware

    const totalOrders = await Order.countDocuments({ assignedPartner: partnerId });

    const completedOrders = await Order.countDocuments({
      assignedPartner: partnerId,
      status: "Confirmed", // Assuming "Confirmed" means completed
    });

    const incompleteOrders = await Order.countDocuments({
      assignedPartner: partnerId,
      status: { $in: ["Pending"] }, // Add more if you have other in-progress states
    });

    const earnings = await Order.aggregate([
      {
        $match: {
          assignedPartner: partnerId,
          status: "Confirmed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }, // Summing up earnings
        },
      },
    ]);

    res.json({
      totalOrders,
      completedOrders,
      incompleteOrders,
      earnings: earnings[0]?.total || 0,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


