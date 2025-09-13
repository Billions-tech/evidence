// backend/routes/user.js
const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getSubscription,
} = require("../controllers/userController");

module.exports = (prisma) => {
  // Get profile
  router.get("/profile", async (req, res) => {
    try {
      const profile = await getProfile(prisma, req.userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Update profile
  router.put("/profile", async (req, res) => {
    try {
      await updateProfile(prisma, req.userId, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Change password
  router.put("/password", async (req, res) => {
    try {
      await changePassword(prisma, req.userId, req.body.current, req.body.new);
      res.json({ success: true });
    } catch (error) {
      res
        .status(400)
        .json({ error: error.message || "Failed to change password" });
    }
  });

  // Get subscription
  router.get("/subscription", async (req, res) => {
    try {
      const sub = await getSubscription(prisma, req.userId);
      res.json(sub);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Delete account
  router.delete("/delete", async (req, res) => {
    try {
      await prisma.user.delete({ where: { id: req.userId } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  return router;
};
