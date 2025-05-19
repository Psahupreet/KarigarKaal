// routes/partnerRoutes.js
import express from "express";
import {
  registerPartner,
  verifyOTP,
  sendLoginOtp,
  verifyLoginOtp,
  getAllPartners,
  deletePartner,
  getPartnerDashboardStats,
  // uploadDocuments, // ✅ NEW controller
} from "../controllers/partnerController.js";
import  {uploadPartnerDocuments,updateDocumentStatus}   from "../controllers/partnerDocs.js";
import { checkDocumentsStatus } from "../controllers/partnerDocs.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
// import { uploadDocs } from "../middleware/upload.js";
import  partnerAuth from "../middleware/partnerAuth.js";
import { protectPartner } from "../middleware/authPartner.js";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });



// ✅ Existing routes
router.post("/register", registerPartner);
router.get("/", getAllPartners);
router.delete("/:id", deletePartner);
router.post("/verify", verifyOTP);
router.post("/send-login-otp", sendLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/check-documents", partnerAuth, checkDocumentsStatus);
router.post(
  "/upload-documents",
  partnerAuth,
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "diploma", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "policeVerification", maxCount: 1 },
  ]),
  uploadPartnerDocuments
);

// Admin verifies or declines partner documents
router.put("/verify-documents/:partnerId", adminProtect, updateDocumentStatus);

//get partner dashboards 
router.get("/dashboard-stats",protectPartner , getPartnerDashboardStats);



export default router;
