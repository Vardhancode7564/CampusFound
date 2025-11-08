// Simple email test script
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

console.log('=== Testing Email Configuration ===\n');

// Check environment variables
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || '❌ Not set');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ Not set');
console.log('\n');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Email credentials are missing in .env file!');
  process.exit(1);
}

// Create transporter (NOTE: it's createTransport, not createTransporter)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the connection
console.log('Testing SMTP connection...\n');
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Wrong email/password');
    console.error('2. Need to use App Password (not regular password) for Gmail');
    console.error('3. Less secure app access needs to be enabled');
    console.error('4. Two-factor authentication is enabled (use App Password)');
    console.error('\nGenerate Gmail App Password: https://myaccount.google.com/apppasswords');
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('Server is ready to send emails\n');
    
    // Send test email
    console.log('Sending test email...\n');
    const mailOptions = {
      from: `"CampusFound Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'CampusFound Email Test - ' + new Date().toLocaleString(),
      html: `
        <h1>✅ Email Configuration Test Successful!</h1>
        <p>This is a test email from CampusFound backend.</p>
        <p>If you received this email, your email configuration is working correctly! 🎉</p>
        <p><strong>Tested at:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: 'Email Configuration Test - If you received this email, your email configuration is working correctly!'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Failed to send test email:', err.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log(`Email sent to: ${process.env.EMAIL_USER}`);
        console.log('\n📧 Check your inbox (and spam folder)!');
      }
      process.exit(err ? 1 : 0);
    });
  }
});
