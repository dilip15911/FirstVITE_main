const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
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

module.exports = router;
