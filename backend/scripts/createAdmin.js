const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusfound');
    console.log('✅ Connected to MongoDB');

    // Admin details
    const adminData = {
      username: 'admin',
      email: 'admin@rguktsklm.ac.in',
      password: 'Admin@123', // Change this to a secure password
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', adminData.email);
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create(adminData);
    console.log('✅ Admin created successfully!');
    console.log('👤 Username:', admin.username);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminData.password);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
