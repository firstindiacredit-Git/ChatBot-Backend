const express = require("express");
const { authUser, adminLogin, signupAdmin, getTodayUsers, getLiveUsers, getTodayAndLast7DaysUsers, getLiveUserCounts } = require("../controllers/authController"); // Import signupAdmin
const { getUsers } = require("../controllers/authController");
const User = require("../models/User");
const upload = require('../middlewares/upload');
const router = express.Router();

router.post("/user/auth", authUser); // User authentication or account creation
router.post("/admin/login", adminLogin); // Admin login
router.post("/admin/signup",upload.single('profileImage'), signupAdmin); // Admin signup route
router.get('/admin/users', getUsers);
router.get('/admin/live-user-counts', getLiveUserCounts);
router.get('/users', async (req, res) => {
    const { websiteId } = req.query; // Get websiteId from query parameters
    try {
        const users = await User.find({ websiteId }); // Fetch users with the specified websiteId
        res.json(users); // Send the users as JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;



// router.get('/admin/live-users', getLiveUsers); // Fetch live users
// router.get('/admin/today-users', getTodayUsers); // Fetch today's users
// router.get('/admin/today-and-last-7-days-users', getTodayAndLast7DaysUsers);

// router.post('/admin/users/batch', async (req, res) => {
//     const { ids } = req.body; // Expecting an array of user IDs
//     try {
//       const users = await User.find({ _id: { $in: ids } }); // Fetch users by IDs
//       res.json(users); // Send the users as JSON response
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching users' });
//     }
//   });
