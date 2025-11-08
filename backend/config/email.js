const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // gmail, outlook, yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
  });
};

// Admin email for oversight - receives BCC of all claim and contact notifications
// This allows admin to monitor all communications and intervene if there are any misleads
const ADMIN_EMAIL = 'campusfoundrguktsklm@gmail.com';

// Send email function
const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email service is not configured');
  }

  const mailOptions = {
    from: `"CampusFound" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    bcc: options.bcc, // Support for BCC
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

// Send item contact email
const sendItemContactEmail = async (itemOwner, contactPerson, item, message) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .item-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
        .message-box { background: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; border-radius: 4px; }
        .contact-info { background: #e7f3ff; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3; border-radius: 4px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        h2 { color: #667eea; margin-top: 0; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Someone is interested in your ${item.type} item!</h1>
        </div>
        
        <div class="content">
          <p>Hello <strong>${itemOwner.name}</strong>,</p>
          <p>Someone has contacted you regarding your ${item.type} item posted on CampusFound.</p>
          
          <div class="item-details">
            <h2>📦 Item Details</h2>
            <p><span class="label">Title:</span> ${item.title}</p>
            <p><span class="label">Category:</span> ${item.category}</p>
            <p><span class="label">Type:</span> ${item.type.toUpperCase()}</p>
            <p><span class="label">Location:</span> ${item.location}</p>
            ${item.description ? `<p><span class="label">Description:</span> ${item.description}</p>` : ''}
          </div>

          ${message ? `
          <div class="message-box">
            <h2>💬 Message from Contact</h2>
            <p>${message}</p>
          </div>
          ` : ''}

          <div class="contact-info">
            <h2>👤 Contact Person Details</h2>
            <p><span class="label">Name:</span> ${contactPerson.name}</p>
            <p><span class="label">Email:</span> <a href="mailto:${contactPerson.email}">${contactPerson.email}</a></p>
            ${contactPerson.phone ? `<p><span class="label">Phone:</span> ${contactPerson.phone}</p>` : ''}
            ${contactPerson.studentId ? `<p><span class="label">Student ID:</span> ${contactPerson.studentId}</p>` : ''}
          </div>

          <p>You can reply directly to this email or contact them using the information provided above.</p>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/items/${item._id}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Item on CampusFound
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated email from CampusFound - Lost & Found Platform</p>
          <p>RGUKT SKLM Campus</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
    Someone is interested in your ${item.type} item!

    Item Details:
    - Title: ${item.title}
    - Category: ${item.category}
    - Type: ${item.type.toUpperCase()}
    - Location: ${item.location}
    ${item.description ? `- Description: ${item.description}` : ''}

    ${message ? `Message: ${message}` : ''}

    Contact Person:
    - Name: ${contactPerson.name}
    - Email: ${contactPerson.email}
    ${contactPerson.phone ? `- Phone: ${contactPerson.phone}` : ''}
    ${contactPerson.studentId ? `- Student ID: ${contactPerson.studentId}` : ''}

    View item: ${process.env.CLIENT_URL || 'http://localhost:5173'}/items/${item._id}
  `;

  // Send email to item owner with BCC to admin for oversight
  return await sendEmail({
    to: itemOwner.email,
    bcc: ADMIN_EMAIL, // Admin gets a copy for oversight
    subject: `CampusFound: Someone contacted you about "${item.title}"`,
    html: emailHTML,
    text: emailText,
  });
};

// Send claim notification email
const sendClaimNotificationEmail = async (itemOwner, claimant, item, claimMessage) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .item-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
        .claim-box { background: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; border-radius: 4px; }
        .claimant-info { background: #e7f3ff; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3; border-radius: 4px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .alert-box { background: #d4edda; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; border-radius: 4px; }
        h2 { color: #667eea; margin-top: 0; }
        .label { font-weight: bold; color: #666; }
        .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Claim Submitted for Your ${item.type === 'lost' ? 'Lost' : 'Found'} Item!</h1>
        </div>
        
        <div class="content">
          <p>Hello <strong>${itemOwner.name}</strong>,</p>
          
          <div class="alert-box">
            <strong>Great News!</strong> Someone has submitted a claim for your item on CampusFound. Please review the details below.
          </div>
          
          <div class="item-details">
            <h2>📦 Item Details</h2>
            <p><span class="label">Title:</span> ${item.title}</p>
            <p><span class="label">Category:</span> ${item.category}</p>
            <p><span class="label">Type:</span> ${item.type.toUpperCase()}</p>
            <p><span class="label">Location:</span> ${item.location}</p>
            ${item.description ? `<p><span class="label">Description:</span> ${item.description}</p>` : ''}
          </div>

          ${claimMessage ? `
          <div class="claim-box">
            <h2>💬 Claimant's Message</h2>
            <p><em>"${claimMessage}"</em></p>
          </div>
          ` : ''}

          <div class="claimant-info">
            <h2>👤 Claimant Details</h2>
            <p><span class="label">Name:</span> ${claimant.name}</p>
            <p><span class="label">Email:</span> <a href="mailto:${claimant.email}">${claimant.email}</a></p>
            ${claimant.phone ? `<p><span class="label">Phone:</span> ${claimant.phone}</p>` : ''}
            ${claimant.studentId ? `<p><span class="label">Student ID:</span> ${claimant.studentId}</p>` : ''}
          </div>

          <div style="background: #f0f9ff; padding: 15px; margin: 15px 0; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1e40af;">📋 Next Steps:</h3>
            <ol>
              <li>Review the claimant's information and message carefully</li>
              <li>Contact them to verify ownership and arrange item handover</li>
              <li>Update the claim status on CampusFound after verification</li>
            </ol>
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/items/${item._id}" 
               class="btn">
              View Item & Claims
            </a>
            <a href="mailto:${claimant.email}" 
               class="btn" style="background: #28a745;">
              Reply to Claimant
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from CampusFound - Lost & Found Platform</p>
          <p>RGUKT SKLM Campus</p>
          <p style="margin-top: 10px; font-size: 11px; color: #aaa;">
            You received this email because someone submitted a claim for your item. 
            If you believe this is a mistake, please login to CampusFound and check your items.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
    New Claim Submitted for Your ${item.type === 'lost' ? 'Lost' : 'Found'} Item!

    Item Details:
    - Title: ${item.title}
    - Category: ${item.category}
    - Type: ${item.type.toUpperCase()}
    - Location: ${item.location}
    ${item.description ? `- Description: ${item.description}` : ''}

    ${claimMessage ? `Claimant's Message:\n"${claimMessage}"` : ''}

    Claimant Details:
    - Name: ${claimant.name}
    - Email: ${claimant.email}
    ${claimant.phone ? `- Phone: ${claimant.phone}` : ''}
    ${claimant.studentId ? `- Student ID: ${claimant.studentId}` : ''}

    Next Steps:
    1. Review the claimant's information and message carefully
    2. Contact them to verify ownership and arrange item handover
    3. Update the claim status on CampusFound after verification

    View item and claims: ${process.env.CLIENT_URL || 'http://localhost:5173'}/items/${item._id}
    Reply to claimant: ${claimant.email}
  `;

  // Send email to item owner with BCC to admin for oversight
  return await sendEmail({
    to: itemOwner.email,
    bcc: ADMIN_EMAIL, // Admin gets a copy for oversight
    subject: `CampusFound: New Claim for "${item.title}"`,
    html: emailHTML,
    text: emailText,
  });
};

module.exports = {
  sendEmail,
  sendItemContactEmail,
  sendClaimNotificationEmail,
};
