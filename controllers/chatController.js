const mongoose = require('mongoose');
const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const attachment = req.file ? `/uploads/${req.file.filename}` : null;

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid senderId or receiverId" });
        }

        if (!content) {
            return res.status(400).json({ error: "Message content is required" });
        }

        const message = new Message({ senderId, receiverId, content, attachment });
        await message.save();

        // const io = req.app.get('io');
        // if (io) {
        //     io.to(receiverId).emit('receive_message', message);
        // }


        res.status(201).json({ message });
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "An error occurred while sending the message." });
    }
};

const getMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }


        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { sendMessage, getMessages };
