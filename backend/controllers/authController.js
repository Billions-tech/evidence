// controllers/authController.js

const crypto = require("crypto");
const nodemailer = require("nodemailer");
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


async function requestPasswordReset(prisma, email, baseUrl) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("No user with that email");
  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });
  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Evidence Password Reset",
    html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link expires in 30 minutes.</p>`,
  });
  return true;
}

async function resetPassword(prisma, token, newPassword) {
  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!reset || reset.used || reset.expiresAt < new Date())
    throw new Error("Invalid or expired token");
  const user = await prisma.user.findUnique({ where: { id: reset.userId } });
  if (!user) throw new Error("User not found");
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
  return true;
}

module.exports = { register, login, resetPassword, requestPasswordReset };
