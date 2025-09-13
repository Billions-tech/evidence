const express = require("express");
const router = express.Router();
const {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

module.exports = (prisma) => {
  // Get all inventory items for the logged-in user
  router.get("/", async (req, res) => {
    try {
      const inventory = await getAllInventory(prisma, req.userId);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  // Create a new inventory item
  router.post("/", async (req, res) => {
    try {
      const inventory = await createInventory(prisma, req.body, req.userId);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inventory" });
    }
  });

  // Update an inventory item
  router.put("/:id", async (req, res) => {
    try {
      const inventory = await updateInventory(
        prisma,
        parseInt(req.params.id),
        req.body,
        req.userId
      );
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory" });
    }
  });

  // Delete an inventory item
  router.delete("/:id", async (req, res) => {
    try {
      await deleteInventory(prisma, parseInt(req.params.id), req.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inventory" });
    }
  });

  return router;
};
