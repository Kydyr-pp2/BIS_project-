const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const pool = require("../db");

const router = express.Router();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const genericMessage =
  "If this email is registered, a password reset link will be sent.";

router.post("/forgot-password", async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase() : "";

    if (!email || email.length > 254) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const result = await pool.query(
      "SELECT id, email FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [email]
    );

    // Do not reveal whether an account exists.
    if (result.rows.length === 0) {
      return res.json({ message: genericMessage });
    }

    const user = result.rows[0];
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET reset_token_hash = $1, reset_token_expires = $2
       WHERE id = $3`,
      [tokenHash, expiresAt, user.id]
    );

    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const resetUrl = new URL("/reset-password", process.env.FRONTEND_URL);
    resetUrl.searchParams.set("token", rawToken);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Hotel Booking System — Password reset",
      text: `Reset your password: ${resetUrl.toString()}\nThis link expires in 15 minutes.`,
      html: `<h2>Password reset</h2>
        <p><a href="${resetUrl.toString()}">Reset my password</a></p>
        <p>This link expires in 15 minutes. If you did not request it, ignore this email.</p>`
    });

    return res.json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Unable to process the request." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token) ||
        typeof newPassword !== "string") {
      return res.status(400).json({ message: "Invalid request." });
    }

    const passwordBytes = Buffer.byteLength(newPassword, "utf8");
    if (passwordBytes < 8 || passwordBytes > 72) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and no more than 72 bytes."
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Atomic update: a valid token can only be consumed once.
    const result = await pool.query(
      `UPDATE users
       SET password_hash = $1,
           reset_token_hash = NULL,
           reset_token_expires = NULL
       WHERE reset_token_hash = $2
         AND reset_token_expires > NOW()
       RETURNING id`,
      [passwordHash, tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    return res.json({
      message: "Password successfully reset. You can now log in."
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Unable to reset password." });
  }
});

module.exports = router;
