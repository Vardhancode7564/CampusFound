const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Create new claim
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is still active
    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This item is no longer available for claims'
      });
    }

    // Check if user is trying to claim their own item
    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    // Check if user has already claimed this item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user.id
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a claim for this item'
      });
    }

    // Create claim
    const claim = await Claim.create({
      itemId,
      claimantId: req.user.id,
      message
    });

    const populatedClaim = await Claim.findById(claim._id)
      .populate('claimantId', 'name email phone studentId')
      .populate('itemId', 'title type');

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      data: populatedClaim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all claims for an item (for item owner)
// @route   GET /api/claims/item/:itemId
// @access  Private
const getItemClaims = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item or is admin
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view claims for this item'
      });
    }

    const claims = await Claim.find({ itemId: req.params.itemId })
      .populate('claimantId', 'name email phone studentId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's claims
// @route   GET /api/claims/my
// @access  Private
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user.id })
      .populate('itemId', 'title type imageURL location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update claim status
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res) => {
  try {
    const { status, verificationDetails } = req.body;

    const claim = await Claim.findById(req.params.id).populate('itemId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    const item = await Item.findById(claim.itemId);

    // Check if user owns the item
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this claim'
      });
    }

    claim.status = status;
    if (verificationDetails) {
      claim.verificationDetails = verificationDetails;
    }

    if (status === 'approved') {
      claim.resolvedAt = Date.now();
      item.status = 'claimed';
      await item.save();
    }

    await claim.save();

    const updatedClaim = await Claim.findById(claim._id)
      .populate('claimantId', 'name email phone studentId')
      .populate('itemId', 'title type');

    res.status(200).json({
      success: true,
      message: 'Claim updated successfully',
      data: updatedClaim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete claim
// @route   DELETE /api/claims/:id
// @access  Private
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if user owns the claim or is admin
    if (claim.claimantId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this claim'
      });
    }

    await claim.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClaim,
  getItemClaims,
  getMyClaims,
  updateClaimStatus,
  deleteClaim
};
