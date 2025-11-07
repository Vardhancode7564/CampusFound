const Item = require('../models/Item');
const User = require('../models/User');
const { sendItemContactEmail } = require('../config/email');

// @desc    Contact item owner via email
// @route   POST /api/items/:id/contact
// @access  Private (authenticated users only)
const contactItemOwner = async (req, res) => {
  try {
    const { message } = req.body;
    const itemId = req.params.id;

    // Validate message
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    // Find the item and populate owner details
    const item = await Item.findById(itemId).populate('postedBy', 'name email phone studentId');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if user is trying to contact their own post
    if (item.postedBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot contact yourself about your own item',
      });
    }

    // Get contact person (current user) details
    const contactPerson = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      studentId: req.user.studentId,
    };

    // Send email to item owner
    try {
      await sendItemContactEmail(
        item.postedBy,      // Item owner
        contactPerson,       // Person contacting
        item,                // Item details
        message              // Message from contact person
      );

      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully to the item owner',
        data: {
          sentTo: item.postedBy.email,
          itemTitle: item.title,
        },
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Even if email fails, provide contact info
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Email service may not be configured.',
        fallback: {
          ownerEmail: item.postedBy.email,
          ownerPhone: item.postedBy.phone,
          message: 'You can contact the owner directly using the email/phone provided above',
        },
      });
    }
  } catch (error) {
    console.error('Contact item owner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing your request',
      error: error.message,
    });
  }
};

module.exports = {
  contactItemOwner,
};
