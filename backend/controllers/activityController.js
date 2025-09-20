// backend/controllers/activityController.js


module.exports = {
  async logActivity(prisma, req, res) {
    try {
      const { userId, action, details } = req.body;
      await prisma.activityLog.create({
        data: { userId, action, details },
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
