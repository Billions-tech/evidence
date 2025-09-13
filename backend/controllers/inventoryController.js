// backend/controllers/inventoryController.js


module.exports = {
  // Get all inventory items for a user
  async getAllInventory(prisma, userId) {
    return await prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Create a new inventory item
  async createInventory(prisma, data, userId) {
    return await prisma.inventoryItem.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  // Update an inventory item
  async updateInventory(prisma, id, data, userId) {
    return await prisma.inventoryItem.updateMany({
      where: { id: Number(id), userId },
      data,
    });
  },

  // Delete an inventory item
  async deleteInventory(prisma, id, userId) {
    return await prisma.inventoryItem.deleteMany({
      where: { id: Number(id), userId },
    });
  },
};
