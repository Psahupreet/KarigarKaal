import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      title: String,
      price: Number,
      imageUrl: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    addressType: { type: String, enum: ["Home", "Office", "Other"], required: true },
    fullAddress: { type: String, required: true },
    timeSlot: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  assignedPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  requestStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Declined"],
    default: "Pending",
  },
  requestExpiresAt: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
