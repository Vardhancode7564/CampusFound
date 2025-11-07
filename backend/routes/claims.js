const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { protectUser } = require('../middleware/auth');

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

    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      message,
      verificationDetails,
    });

    res.status(201).json({ success: true, claim });
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

module.exports = router;
