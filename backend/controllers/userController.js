// backend/controllers/userController.js
const bcrypt = require("bcryptjs");

module.exports = {
  async getProfile(prisma, userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        businessName: true,
        slogan: true,
        logo: true,
        phoneNumber: true,
        defaultFooterMsg: true,
      },
    });
  },

  async updateProfile(prisma, userId, data) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  async changePassword(prisma, userId, current, newPw) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    const valid = await bcrypt.compare(current, user.password);
    if (!valid) throw new Error("Current password incorrect");
    const hashed = await bcrypt.hash(newPw, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return true;
  },

  async getSubscription(prisma, userId) {
    // Placeholder: always return Free
    return { status: "Free", renewal: "-" };
  },
};
