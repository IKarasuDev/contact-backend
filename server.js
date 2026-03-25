import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/send-email", async (req, res) => {
  const { name_user, email_user, subject, message } = req.body;

  if (!name_user || !email_user || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    console.log("📨 Sending email with Resend...");

    await resend.emails.send({
      from: "onboarding@resend.dev", // temporal (sandbox)
      to: process.env.EMAIL_USER,
      subject: subject,
      text: `
Name: ${name_user}
Email: ${email_user}
Message: ${message}
      `,
    });

    console.log("✅ Email sent");

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Resend error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});