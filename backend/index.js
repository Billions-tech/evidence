// Prisma setup
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const express = require("express");
const cors = require("cors");
const receiptRoutes = require("./routes/receipt")(prisma);
const authRoutes = require("./routes/auth")(prisma);
const notesRoutes = require("./routes/notes")(prisma);
const expenseRoutes = require("./routes/expense")(prisma);
const userRoutes = require("./routes/user")(prisma);
const inventoryRoutes = require("./routes/inventory")(prisma);
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Use receipt routes

app.use("/api/auth", authRoutes);
app.use("/api/receipts", authMiddleware, receiptRoutes);
app.use("/api/notes", authMiddleware, notesRoutes);
app.use("/api/expenses", authMiddleware, expenseRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/inventory", authMiddleware, inventoryRoutes);
app.use("/api/admin", require("./routes/admin")(prisma));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;
