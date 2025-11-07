const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protectUser } = require('../middleware/auth');

// @route   GET /api/user/items
// @desc    Get current user's items
// @access  Private
router.get('/items', protectUser, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, items, count: items.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
