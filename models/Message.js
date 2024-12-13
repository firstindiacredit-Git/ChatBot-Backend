const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String },
  attachment: { type: String },
  
},{ timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
