// Verify receipt from uploaded image/PDF
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");
const fileType = require("file-type");
const Poppler = require("pdf-poppler");
const fs = require("fs");

async function verifyUploadReceipt(prisma, fileBuffer) {
  let bufferToProcess = fileBuffer;
  try {
    // Detect file type
    const type = await fileType.fromBuffer(fileBuffer);
    if (type && type.mime === "application/pdf") {
      // Convert first page of PDF to image
      const tmpPath = `./tmp_${Date.now()}.pdf`;
      fs.writeFileSync(tmpPath, fileBuffer);
      const outputDir = `./tmp_${Date.now()}`;
      fs.mkdirSync(outputDir);
      await Poppler.convert(tmpPath, {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: "page",
        page: 1,
      });
      const imgPath = `${outputDir}/page-1.jpg`;
      bufferToProcess = fs.readFileSync(imgPath);
      // Clean up temp files
      fs.unlinkSync(tmpPath);
      fs.unlinkSync(imgPath);
      fs.rmdirSync(outputDir);
    }
    // Preprocess image for better QR detection
    let image = await Jimp.read(bufferToProcess);
    // Log image info for debugging
    // Crop center square of the image before resizing
    const minDim = Math.min(image.bitmap.width, image.bitmap.height);
    const cropX = Math.floor((image.bitmap.width - minDim) / 2);
    const cropY = Math.floor((image.bitmap.height - minDim) / 2);
    image = image.crop(cropX, cropY, minDim, minDim);
    // Resize to larger square for QR detection
    image = image.resize(600, 600);
    // Less aggressive preprocessing: only greyscale
    image = image.greyscale();
    // Try QR detection
    return await new Promise((resolve) => {
      const qr = new QrCode();
      qr.callback = async (err, value) => {
        if (err || !value) {
          console.error("QR decode error:", err);
          resolve({ valid: false, error: "QR code not found in image." });
        } else {
          // Use the decoded QR code data to verify receipt
          const receipt = await verifyReceipt(prisma, value.result);
          if (receipt) {
            resolve({ valid: true, receipt, qrData: value.result });
          } else {
            resolve({ valid: false, error: "Receipt not found or invalid." });
          }
        }
      };
      qr.decode(image.bitmap);
    });
  } catch (err) {
    console.error("QR extraction error:", err);
    return {
      valid: false,
      error: "Failed to process image or extract QR code.",
    };
  }
}
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
  verifyUploadReceipt,
};
