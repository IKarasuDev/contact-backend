import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta base (opcional pero útil para verificar en Render)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Endpoint principal
app.post("/send-email", async (req, res) => {
  const { name_user, email_user, subject, message } = req.body;

  // Validación básica backend
  if (!name_user || !email_user || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: subject,
      text: `
Name: ${name_user}
Email: ${email_user}
Message: ${message}
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// 🔥 IMPORTANTE: usar puerto dinámico (Render lo requiere)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});