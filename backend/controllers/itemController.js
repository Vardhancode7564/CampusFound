const Item = require('../models/Item');
const cloudinary = require('cloudinary').v2;

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, category, status, search, sortBy = '-createdAt', page = 1, limit = 12 } = req.query;

    // Build query
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const items = await Item.find(query)
      .populate('postedBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email phone studentId');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { type, title, description, category, location, date, imageURL, imagePublicId } = req.body;

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      imageURL,
      imagePublicId,
      postedBy: req.user.id,
      contactInfo: {
        email: req.user.email,
        phone: req.user.phone
      }
    });

    const populatedItem = await Item.findById(item._id).populate('postedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      data: populatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // If updating image, delete old one from Cloudinary
    if (req.body.imageURL && item.imagePublicId && req.body.imagePublicId !== item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    // Delete image from Cloudinary if exists
    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's items
// @route   GET /api/items/my/posts
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getMyItems
};
