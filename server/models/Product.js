import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type: String, required: true},
  price:{type:  Number, required: true},
  rating: {type:  Number, required: true},
  review: {type: String, required: true},
  images: [String],
  
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
