// backend/controllers/adminController.js

module.exports = {
  async getMetrics(prisma, req, res) {
    try {
      const usersCount = await prisma.user.count();
      const userDetails = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          businessName: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
        },
      });
      const receipts = await prisma.receipt.count();
      const downloads = await prisma.activityLog.count({
        where: { action: "download" },
      });
      const shares = await prisma.activityLog.count({
        where: { action: "share" },
      });
      res.json({ users: usersCount, userDetails, receipts, downloads, shares });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getActivity(prisma, req, res) {
    try {
      const logs = await prisma.activityLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 20,
        include: {
          user: {
            select: {
              name: true,
              businessName: true,
            },
          },
        },
      });
      res.json(
        logs.map((log) => ({
          userId: log.userId,
          userName: log.user?.name,
          businessName: log.user?.businessName,
          action: log.action,
          details: log.details,
          timestamp: log.timestamp,
        }))
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
