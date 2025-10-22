import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    // Cắt chuỗi "Bearer " để lấy token thật
    const token = authHeader.split(" ")[1];

    // Xác thực token với secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    // Lưu thông tin user đã decode vào request (để các route khác dùng)
    req.user = decoded;

    // Tiếp tục đến middleware/route handler tiếp theo
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};
