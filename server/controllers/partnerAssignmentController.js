// controllers/partnerAssignmentController.js
import Order from "../models/Order.js";
import Partner from "../models/Partner.js";
import nodemailer from "nodemailer";

// Setup nodemailer transporter (configure with your Gmail or SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Assign specific partner to order based on availability
export const assignPartnerToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const serviceType = order.items[0]?.title?.toLowerCase();
    if (!serviceType) {
      return res.status(400).json({ message: "Service type missing in order items" });
    }

    const availablePartner = await Partner.findOne({
      isVerified: true,
      isApproved: true,
      isDeclined: false,
      verificationStatus: "verified",
    });

    if (!availablePartner) {
      return res.status(404).json({ message: "No available partner found" });
    }

    order.assignedPartner = availablePartner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
    await order.save();

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: availablePartner.email,
      subject: "New Service Request",
      html: `
        <h3>New Service Request Assigned</h3>
        <p><strong>Customer:</strong> ${order.user.name}</p>
        <p><strong>Email:</strong> ${order.user.email}</p>
        <p><strong>Service:</strong> ${order.items[0].title}</p>
        <p><strong>Scheduled Time:</strong> ${order.address.timeSlot}</p>
        <p><strong>Address:</strong> ${order.address.fullAddress}</p>
        <p>Please log in to your dashboard to accept or decline the job within 2 minutes.</p>
      `,
    };

    await transporter.sendMail(emailOptions);

    res.status(200).json({
      message: "Partner assigned and notified via email",
      order,
    });
  } catch (err) {
    console.error("❌ Partner Assignment Error:", err);
    res.status(500).json({ message: "Failed to assign partner" });
  }
};

// ✅ Auto-assign partner during order placement
export const assignPartnerAutomatically = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const serviceType = order.items[0]?.title?.toLowerCase();

    const availablePartner = await Partner.findOne({
      isApproved: true,
      isVerified: true,
      isDeclined: false,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
    });

    if (!availablePartner) {
      return res.status(404).json({ message: "No available partner found" });
    }

    order.assignedPartner = availablePartner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
    await order.save();

    const customerInfo = `
      Name: ${order.user.name}<br>
      Email: ${order.user.email}<br>
      Address: ${order.address.fullAddress}<br>
      Time Slot: ${order.address.timeSlot}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: availablePartner.email,
      subject: "New Service Request",
      html: `<h3>New ${serviceType} Service Request</h3><p>${customerInfo}</p><p>Respond in your dashboard within 2 minutes.</p>`,
    });

    res.status(200).json({
      message: "Partner auto-assigned and email sent",
      partner: availablePartner,
    });
  } catch (err) {
    console.error("Assign Partner Error:", err);
    res.status(500).json({ message: "Failed to auto-assign partner" });
  }
};

// ✅ Partner accepts or declines request
export const partnerRespondToRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { response } = req.body;
    const partnerId = req.partnerId;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedPartner.toString() !== partnerId) {
      return res.status(403).json({ message: "Unauthorized partner" });
    }

    if (new Date() > order.requestExpiresAt) {
      return res.status(400).json({ message: "Request expired" });
    }

    order.requestStatus = response;
    order.status = response === "Accepted" ? "Confirmed" : "Pending";
    await order.save();

    res.status(200).json({ message: `Request ${response.toLowerCase()} successfully` });
  } catch (err) {
    console.error("Partner Response Error:", err);
    res.status(500).json({ message: "Failed to respond to request" });
  }
};

// ✅ Partner dashboard: Get all assigned/accepted orders
export const getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.partnerId;

    const orders = await Order.find({ assignedPartner: partnerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Partner Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch partner orders" });
  }
};
