import jwt from "jsonwebtoken";
import Partner from "../models/Partner.js";

export const protectPartner = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET must match the one used during login

      const partner = await Partner.findById(decoded.id).select("-password");
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      req.partner = partner; // ✅ THIS is what you need in your controller
      next();
    } catch (error) {
      console.error("JWT error in protectPartner:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
