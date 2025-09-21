// routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

module.exports = (prisma) => {
  // Registration endpoint
  router.post("/register", async (req, res) => {
    try {
      const { user, token } = await register(prisma, req.body);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login endpoint
  router.post("/login", async (req, res) => {
    try {
      const { user, token } = await login(prisma, req.body);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get logged-in user info
  router.get("/me", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          businessName: true,
          logo: true,
          slogan: true,
          defaultFooterMsg: true,
          createdAt: true,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user info" });
    }
  });
  

  // Request password reset
  router.post("/request-password-reset", async (req, res) => {
    try {
      const { email } = req.body;
      const baseUrl =
        req.headers.origin || req.protocol + "://" + req.get("host");
      await require("../controllers/authController").requestPasswordReset(
        prisma,
        email,
        baseUrl
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reset password
  router.post("/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      await require("../controllers/authController").resetPassword(
        prisma,
        token,
        newPassword
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
