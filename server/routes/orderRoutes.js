// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  placeOrder,
  getAllOrders,
  cancelOrder,
 
} from "../controllers/orderController.js";

import {
  assignPartnerAutomatically,
  assignPartnerToOrder,
  partnerRespondToRequest,
  getPartnerOrders,
} from "../controllers/partnerAssignmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import { protectPartner } from "../middleware/authPartner.js";

const router = express.Router();

// ========== USER ROUTES ==========
router.post("/", protect, createOrder);
router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.delete("/:id", protect, cancelOrder);

// ========== ADMIN ROUTES ==========
router.get("/AllOrders", adminProtect, getAllOrders);
router.post("/assign-partner/:orderId", adminProtect, assignPartnerAutomatically);
router.post("/assign-partner-manual/:orderId", adminProtect, assignPartnerToOrder); // optional manual route

// ========== PARTNER ROUTES ==========
router.post("/respond/:orderId", protectPartner, partnerRespondToRequest);
router.get("/partner-orders", protectPartner, getPartnerOrders);
export default router;
