// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

async function register(prisma, data) {
  // Validate required fields
  if (!data.name || !data.email || !data.password) {
    throw new Error("Name, email, and password are required");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        logo: data.logo,
        slogan: data.slogan,
        defaultFooterMsg: data.defaultFooterMsg,
      },
    });
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return { user, token };
  } catch (error) {
    throw error;
  }
}

async function login(prisma, data) {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

module.exports = { register, login };
