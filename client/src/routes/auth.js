const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@example.com" && password === "password") {
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/auth/signup", (req, res) => {
  // TO DO: implement signup logic
  return res.json({ message: "Signup route" });
});

router.post("/auth/verify", (req, res) => {
  const { userId, otp } = req.body;
  // TO DO: implement verify email logic
  return res.json({ message: "Verify email route" });
});

router.post("/auth/resend-otp", (req, res) => {
  const { userId } = req.body;
  // TO DO: implement resend verification logic
  return res.json({ message: "Resend verification route" });
});

router.get("/auth/profile", (req, res) => {
  // TO DO: implement get profile logic
  return res.json({ message: "Get profile route" });
});

router.put("/auth/profile", (req, res) => {
  const { data } = req.body;
  // TO DO: implement update profile logic
  return res.json({ message: "Update profile route" });
});

router.get("/auth/history", (req, res) => {
  // TO DO: implement get user history logic
  return res.json({ message: "Get user history route" });
});

router.post("/auth/restore", (req, res) => {
  const { historyId } = req.body;
  // TO DO: implement restore profile logic
  return res.json({ message: "Restore profile route" });
});

module.exports = router;
