const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Contact = require('../models/Contact');

// Configure Nodemailer (optional)
let transporter = null;
try {
  const nodemailer = require('nodemailer');
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
} catch (error) {
  console.log('⚠️  Nodemailer not configured. Email notifications disabled.');
}

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'campus-contact' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      message,
      imageUrl,
    });
    await contact.save();

    // Send email notification (if configured)
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email, // Send to the person who submitted
          subject: 'Contact Form Submission - CampusFound',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Thank you for contacting CampusFound</h2>
              <p>Dear ${name},</p>
              <p>We have received your message and will get back to you soon.</p>
              <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Your Message:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
                ${imageUrl ? `<p><strong>Image:</strong> <a href="${imageUrl}">View Attachment</a></p>` : ''}
              </div>
              <p>Best regards,<br/>CampusFound Team</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }
    }

    res.status(201).json({ 
      success: true,
      message: 'Contact form submitted successfully.' + (transporter ? ' Check your email for confirmation.' : '')
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit contact form. Please try again.' 
    });
  }
});

module.exports = router;
