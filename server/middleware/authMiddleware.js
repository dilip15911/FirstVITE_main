const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("🚫 No token provided");
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ JWT Error:", err.name, "-", err.message);
      
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("✅ Token Verified:", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
