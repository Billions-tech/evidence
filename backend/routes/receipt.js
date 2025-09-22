// routes/receipt.js
const express = require("express");
const router = express.Router();
const {
  createReceipt,
  getReceipt,
  deleteReceipt,
  verifyReceipt,
} = require("../controllers/receiptController");
const multer = require("multer");
const { verifyUploadReceipt } = require("../controllers/receiptController");

module.exports = (prisma) => {
  const upload = multer();
  // Verify receipt authenticity from uploaded image/PDF
  router.post("/verify-upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ valid: false, error: "No file uploaded." });
      }
      const result = await verifyUploadReceipt(prisma, req.file.buffer);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ valid: false, error: error.message || "Verification failed." });
    }
  });
  // Create a receipt
  router.post("/", async (req, res) => {
    try {
      // userId is set by authMiddleware
      const receipt = await createReceipt(prisma, req.body, req.userId);
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ error: "Failed to create receipt" });
    }
  });

  // Get a receipt by ID
  router.get("/:id", async (req, res) => {
    try {
      const receipt = await getReceipt(prisma, req.params.id);
      if (!receipt) return res.status(404).json({ error: "Receipt not found" });
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch receipt" });
    }
  });

  // Dashboard summary: revenue, count, recent receipts
  router.get("/dashboard/summary", async (req, res) => {
    try {
      const userId = req.userId;
      // Get month/year from query, default to current
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;
      const year = parseInt(req.query.year) || new Date().getFullYear();
      // Start and end of month
      const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      // Receipts for this month (include items)
      const monthReceipts = await prisma.receipt.findMany({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      // Calculate month revenue from items
      const monthRevenue = monthReceipts.reduce((sum, r) => {
        if (r.items && Array.isArray(r.items)) {
          return (
            sum + r.items.reduce((itemSum, i) => itemSum + (i.total || 0), 0)
          );
        }
        return sum + (r.amount || 0);
      }, 0);
      // Total revenue
      const allReceipts = await prisma.receipt.findMany({
        where: { userId },
        include: { items: true },
      });
      const totalRevenue = allReceipts.reduce((sum, r) => {
        if (r.items && Array.isArray(r.items)) {
          return (
            sum + r.items.reduce((itemSum, i) => itemSum + (i.total || 0), 0)
          );
        }
        return sum + (r.amount || 0);
      }, 0);
      // Number of receipts for month
      const receiptCount = monthReceipts.length;
      // Recent receipts for month (latest 5, include items)
      const recentReceipts = monthReceipts.slice(0, 5);
      res.json({
        monthRevenue,
        totalRevenue,
        receiptCount,
        recentReceipts,
        monthReceipts, // all receipts for the month
        month,
        year,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  // Get all receipts for user
  router.get("/", async (req, res) => {
    try {
      const userId = req.userId;
      const receipts = await prisma.receipt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch receipts" });
    }
  });

  // Delete a receipt by ID
  router.delete("/:id", async (req, res) => {
    try {
      await deleteReceipt(prisma, req.params.id, req.userId);
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to delete receipt" });
    }
  });

  // Verify receipt authenticity from QR code
  router.post("/verify", async (req, res) => {
    try {
      const { qrData } = req.body;
      const receipt = await verifyReceipt(prisma, qrData);
      if (!receipt)
        return res
          .status(404)
          .json({ valid: false, error: "Receipt not found" });
      res.json({ valid: true, receipt });
    } catch (error) {
      res
        .status(500)
        .json({ valid: false, error: error.message || "Verification failed" });
    }
  });

  return router;
};
