// ✅ Correct
import Partner from "../models/Partner.js";
import PartnerDocument from "../models/partnerDocument.js";

// Upload documents (already working as per your code)
export const uploadPartnerDocuments = async (req, res) => {
  try {
    const { id, name, email } = req.user;
     
    // ✅ Check if partner already submitted documents
    const existingDocs = await PartnerDocument.findOne({ partner: id });
    if (existingDocs) {
      return res.status(400).json({ message: "Documents already submitted." });
    }
    const newDoc = new PartnerDocument({
      partner: id,
      name,
      email,
      documents: {
        aadhaar: req.files?.aadhaar?.[0]?.path,
        pan: req.files?.pan?.[0]?.path,
        marksheet10: req.files?.marksheet10?.[0]?.path,
        marksheet12: req.files?.marksheet12?.[0]?.path,
        diploma: req.files?.diploma?.[0]?.path,
        degree: req.files?.degree?.[0]?.path || null,
        policeVerification: req.files?.policeVerification?.[0]?.path,
      },
      
    });

    await newDoc.save();
     await Partner.findByIdAndUpdate(id, { isDocumentsSubmitted: true, verificationStatus: 'pending' });
    res.status(200).json({ message: "Documents uploaded successfully" });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
};

//update document verification status 
export const updateDocumentStatus = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body; // 'verified' or 'declined'

    if (!["verified", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const doc = await PartnerDocument.findOneAndUpdate(
      { partner: partnerId },
      { status },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.status(200).json({ message: `Document ${status} successfully` });
  } catch (err) {
    console.error("Status Update Error:", err.message);
    res.status(500).json({ message: "Failed to update document status" });
  }
};
//check documents exist or not 
export const checkDocumentsStatus = async (req, res) => {
  try {
    const partner = await Partner.findById(req.user.id).select("isDocumentsSubmitted");
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const documents = await PartnerDocument.findOne({ partner: req.user.id });

    const status = documents ? documents.status : "pending";

    res.json({
      isDocumentsSubmitted: partner.isDocumentsSubmitted,
      status:partner.status || "pending"// from PartnerDocuments
    });
  } catch (err) {
    console.error("Check Documents Error:", err.message);
    res.status(500).json({ message: "Failed to check document status" });
  }
};


// Fetch all partner documents
export const getAllPartnerDocuments = async (req, res) => {
  try {
    const documents = await PartnerDocument.find().select("name email documents");
    res.json(documents);
  } catch (err) {
    console.error("Failed to fetch partner documents:", err.message);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const getPartnerDocuments = async (req, res) => {
  const partners = await Partner.find().select("name email documents");
  res.json(partners);
};

