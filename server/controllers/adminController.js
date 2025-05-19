import { Admin } from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Partner from "../models/Partner.js";
import PartnerDocuments from "../models/partnerDocument.js";

//admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id , role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
// Get all partners grouped by status
export const getAllPartnersByStatus = async (req, res) => {
  try {
    const unverified = await Partner.find({ isVerified: false });
    const pending = await Partner.find({ isVerified: true, isApproved: false, isDeclined: false });
    const verified = await Partner.find({ isApproved: true });
    const declined = await Partner.find({ isDeclined: true });

    res.json({ unverified, pending, verified, declined });
  } catch (err) {
    console.error("Error in getAllPartnersByStatus:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//Verify partner
export const verifyPartner = async (req, res) => {
  await Partner.findByIdAndUpdate(req.params.id, {
    isApproved: true,
    isDeclined: false,
  });
  res.json({ message: "Partner verified" });
};

//Decline partner
export const declinePartner = async (req, res) => {
  await Partner.findByIdAndUpdate(req.params.id, { isDeclined: true, isApproved: false });
  res.json({ message: "Partner declined" });
};

// Verify a partner docs 
export const verifyPartnerst = async (req, res) => {
  try {
    console.log("🔧 Inside verifyPartnerst controller");
    const docId = req.params.id; // this is PartnerDocument ID
    console.log("📌 PartnerDocument ID:", docId);

    const partnerDoc = await PartnerDocuments.findById(docId);

    if (!partnerDoc) {
      console.log("❌ PartnerDocument not found");
      return res.status(404).json({ message: "PartnerDocument not found" });
    }

    const partnerId = partnerDoc.partner; // assumes `partner` field is a ref in your PartnerDocument
    console.log("➡️ Found partner ID from document:", partnerId);

    const updatedPartner = await Partner.findByIdAndUpdate(
      partnerId,
      { isVerified: true, status: "verified" },
      { new: true }
    );

    if (!updatedPartner) {
      console.log("❌ Partner not found");
      return res.status(404).json({ message: "Partner not found" });
    }

    console.log("✅ Partner verified successfully");
    res.status(200).json({ message: "Partner verified", partner: updatedPartner });
  } catch (err) {
    console.error("🔥 Error verifying partner:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Decline a partner docs
export const declinePartnerst = async (req, res) => {
  const { partnerId } = req.params;
  try {
    await Partner.findByIdAndUpdate(partnerId, {
      verificationStatus: "declined",
    });

    await PartnerDocument.findOneAndUpdate(
      { partner: partnerId },
      { status: "declined" }
    );

    res.status(200).json({ message: "Partner declined successfully" });
  } catch (err) {
    console.error("Decline partner error:", err);
    res.status(500).json({ message: "Failed to decline partner" });
  }
};
