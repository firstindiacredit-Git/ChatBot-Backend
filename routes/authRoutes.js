const express = require("express");
const { authUser, adminLogin, signupAdmin } = require("../controllers/authController"); // Import signupAdmin
const { getUsers } = require("../controllers/authController");
const router = express.Router();

router.post("/user/auth", authUser); // User authentication or account creation
router.post("/admin/login", adminLogin); // Admin login
router.post("/admin/signup", signupAdmin); // Admin signup route
router.get('/admin/users', getUsers);


module.exports = router;

















// router.get('/admin/id', async (req, res) => {
//     try {
//       const admin = await Admin.findOne(); // Fetch the first admin in the database
//       if (!admin) {
//         return res.status(404).json({ message: 'Admin not found' });
//       }
//       res.json({ adminId: admin._id }); // Return the admin ID
//     } catch (error) {
//       console.error('Error fetching admin ID:', error.message);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });