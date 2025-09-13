// backend/routes/expense.js
const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

module.exports = (prisma) => {
  // Get all expenses for user
  router.get("/", async (req, res) => {
    try {
      const expenses = await getExpenses(prisma, req.userId);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  // Create an expense
  router.post("/", async (req, res) => {
    try {
      const expense = await createExpense(prisma, req.body, req.userId);
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to create expense" });
    }
  });

  // Update an expense
  router.put("/:id", async (req, res) => {
    try {
      const expense = await updateExpense(
        prisma,
        parseInt(req.params.id),
        req.body,
        req.userId
      );
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to update expense" });
    }
  });

  // Delete an expense
  router.delete("/:id", async (req, res) => {
    try {
      await deleteExpense(prisma, parseInt(req.params.id), req.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  return router;
};
