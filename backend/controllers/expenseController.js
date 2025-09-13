// backend/controllers/expenseController.js

module.exports = {
  // Create an expense
  async createExpense(prisma, data, userId) {
    return await prisma.expense.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  // Get all expenses for a user
  async getExpenses(prisma, userId) {
    return await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  },

  // Update an expense
  async updateExpense(prisma, id, data, userId) {
    return await prisma.expense.updateMany({
      where: { id, userId },
      data,
    });
  },

  // Delete an expense
  async deleteExpense(prisma, id, userId) {
    return await prisma.expense.deleteMany({
      where: { id, userId },
    });
  },
};
