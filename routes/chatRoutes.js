const express = require('express');
const { sendMessage, getMessages,markMessageRead } = require('../controllers/chatController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/message', upload.single('attachment'), sendMessage);
router.get('/messages/:userId', getMessages);
router.post('/messages/mark-read/:userid', markMessageRead);

module.exports = router;
