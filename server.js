const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // For using environment variables



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("Server is working! 🚀");
});
// POST route to handle contact form submission
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS        // App password (not your real Gmail password)
      }
    });

    // Email content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // You can change this to any receiving email
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>Contact Form Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Email sending failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
