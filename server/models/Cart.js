// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      id: String,
      title: String,
      price: Number,
      imageUrl: String,
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
