const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const User = require('../models/User');
const { protectUser } = require('../middleware/auth');
const { sendClaimNotificationEmail, sendEmail } = require('../config/email');

// @route   POST /api/claims
// @desc    Create a new claim
// @access  Private
router.post('/', protectUser, async (req, res) => {
  try {
    const { itemId, message, verificationDetails } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user already claimed this item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user._id
    });
    
    if (existingClaim) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already submitted a claim for this item' 
      });
    }

    // Create the claim
    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      message,
      verificationDetails,
    });

    // Get item owner details for email notification
    const itemOwner = await User.findById(item.postedBy);
    
    // Send email notification to item owner
    if (itemOwner && itemOwner.email) {
      try {
        await sendClaimNotificationEmail(
          itemOwner,
          {
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            studentId: req.user.studentId
          },
          item,
          message
        );
        console.log(`✅ Claim notification email sent to ${itemOwner.email} (BCC: admin)`);
      } catch (emailError) {
        console.error('❌ Failed to send claim notification email:', emailError.message);
        // Don't fail the claim submission if email fails
      }
    }

    res.status(201).json({ 
      success: true, 
      claim,
      message: 'Claim submitted successfully. The item owner has been notified via email.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/claims/my
// @desc    Get current user's claims
// @access  Private
router.get('/my', protectUser, async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user._id })
      .populate('itemId')
      .sort({ createdAt: -1 });

    res.json({ success: true, claims });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/claims/item/:itemId
// @desc    Get claims for a specific item
// @access  Private
router.get('/item/:itemId', protectUser, async (req, res) => {
  try {
    const claims = await Claim.find({ itemId: req.params.itemId })
      .populate('claimantId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, claims });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/claims/:id
// @desc    Update claim status
// @access  Private
router.put('/:id', protectUser, async (req, res) => {
  try {
    const { status } = req.body;
    
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.status = status;
    if (status === 'approved' || status === 'rejected') {
      claim.resolvedAt = Date.now();
    }

    await claim.save();
    res.json({ success: true, claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/claims/test-email
// @desc    Test email configuration
// @access  Private
router.get('/test-email', protectUser, async (req, res) => {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configured' : '❌ Not configured');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email credentials not configured in .env file',
        details: {
          EMAIL_USER: !!process.env.EMAIL_USER,
          EMAIL_PASS: !!process.env.EMAIL_PASS
        }
      });
    }

    await sendEmail({
      to: req.user.email,
      subject: 'CampusFound Email Test',
      html: '<h1>Email Configuration Test</h1><p>If you received this email, your email configuration is working correctly! 🎉</p>',
      text: 'Email Configuration Test - If you received this email, your email configuration is working correctly!'
    });

    res.json({
      success: true,
      message: `Test email sent successfully to ${req.user.email}. Please check your inbox (and spam folder).`
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

module.exports = router;
