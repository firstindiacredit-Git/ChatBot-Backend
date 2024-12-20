const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token (Unified function for both user and admin)
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Authenticate User or Create Account
exports.authUser = async (req, res) => {
  const { name,email, phone } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ phone });
    if (!user) {
      // Create a new user if not found
      user = new User({ name,email, phone });
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
      const users = await User.find(); // Fetch all users from the database
      res.json(users); // Send the users as JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  };
