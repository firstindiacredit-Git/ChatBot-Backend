const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

// Generate JWT Token (Unified function for both user and admin)
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Authenticate User or Create Account
exports.authUser = async (req, res) => {
  const { name,email, phone,services,websiteId,location } = req.body;
  //console.log(location);

  try {
    // Check if the user exists
    let user = await User.findOne({ phone });
    if (!user) {
      // Create a new user if not found
      user = new User({ name,email, phone,services,websiteId,location });
      await user.save();
    } else {
      // Update services if the user already exists
      user.services = services;
      user.location = location;
      
      await user.save();
    }

    // Generate token for the user
    const token = generateToken(user);
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Signup
exports.signupAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin exists by email
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    // Save admin to the database
    await admin.save();

    // Generate token for admin
    const token = generateToken(admin);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token for admin
    const token = generateToken(admin);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { websiteId } = req.query;
    const query = websiteId ? { websiteId } : {};
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getLiveUserCounts = async (req, res) => {
  const { websiteId } = req.query; // Get websiteId from query parameters
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfLast7Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    // Count users created today for the specific websiteId
    const todayUserCount = await User.countDocuments({
      createdAt: { $gte: startOfToday },
      websiteId: websiteId,
    });

    // Count users created in the last 7 days for the specific websiteId
    const last7DaysUserCount = await User.countDocuments({
      createdAt: { $gte: startOfLast7Days },
      websiteId: websiteId,
    });

    // // Count live users for the specific websiteId
    // const liveUserCount = Array.from(global.liveUsers.entries())
    //   .filter(([_, userData]) => userData.websiteId === websiteId)
    //   .length;

    const liveUserCount = Array.from(global.liveUsers.entries()).filter(([userId, id]) => id === websiteId).length;



    const todayLiveUserCount = liveUserCount;
    const last7DaysLiveUserCount = liveUserCount;

    res.json({
      todayUserCount,
      last7DaysUserCount,
      todayLiveUserCount,
      last7DaysLiveUserCount
    });
  } catch (error) {
    console.error('Error in getLiveUserCounts:', error);
    res.status(500).json({ message: 'Error getting user counts' });
  }
};



