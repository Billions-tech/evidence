// Monthly summary for dashboard
async function getMonthlySummary(prisma, userId, month, year) {
  // Calculate start and end dates for the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // Fetch all receipts for the user in the selected month, including items
  const monthReceipts = await prisma.receipt.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate month revenue from items
  const monthRevenue = monthReceipts.reduce((sum, r) => {
    if (r.items && r.items.length > 0) {
      return sum + r.items.reduce((s, i) => s + (i.total || 0), 0);
    }
    return sum;
  }, 0);

  // Total receipts count for the month
  const monthReceiptCount = monthReceipts.length;

  // Recent receipts (latest 6)
  const recentReceipts = monthReceipts.slice(0, 6);

  return {
    monthRevenue,
    monthReceiptCount,
    recentReceipts,
    monthReceipts,
  };
}
// controllers/receiptController.js
// Handles receipt business logic

async function createReceipt(prisma, data, userId) {
  // Basic validation
  if (!data.customer || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Invalid input: customer and items[] are required");
  }
  try {
    // Create receipt
    const receipt = await prisma.receipt.create({
      data: {
        userId: userId,
        customer: data.customer,
        footerMsg: data.footerMsg,
      },
    });
    // Create items
    const itemsToCreate = data.items.map((item) => ({
      receiptId: receipt.id,
      item: item.item,
      unit: item.unit,
      price: parseFloat(item.price),
      total: parseFloat(item.total),
    }));
    await prisma.receiptItem.createMany({ data: itemsToCreate });
    // Return receipt with items
    return await prisma.receipt.findUnique({
      where: { id: receipt.id },
      include: { items: true },
    });
  } catch (error) {
    console.error("Error creating receipt:", error);
    throw error;
  }
}

async function getReceipt(prisma, id) {
  return await prisma.receipt.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });
}

async function deleteReceipt(prisma, id, userId) {
  // Delete all items first, then the receipt
  const receiptId = parseInt(id);
  // Optionally, check ownership
  const receipt = await prisma.receipt.findUnique({ where: { id: receiptId } });
  if (!receipt || receipt.userId !== userId) {
    throw new Error("Receipt not found or unauthorized");
  }
  await prisma.receiptItem.deleteMany({ where: { receiptId } });
  await prisma.receipt.delete({ where: { id: receiptId } });
  return { success: true };
}

async function verifyReceipt(prisma, qrData) {
  // qrData can be a JSON string or just an ID
  let receiptId;
  try {
    const parsed = typeof qrData === "string" ? JSON.parse(qrData) : qrData;
    receiptId = parsed.id || parsed.receiptId || qrData;
  } catch {
    receiptId = qrData;
  }
  if (!receiptId) return null;
  const receipt = await prisma.receipt.findUnique({
    where: { id: parseInt(receiptId) },
    include: { items: true },
  });
  return receipt;
}

module.exports = {
  createReceipt,
  getReceipt,
  deleteReceipt,
  verifyReceipt,
  getMonthlySummary,
};
