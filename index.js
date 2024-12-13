// const http = require('http');
// const mongoose = require('mongoose');
// const app = require('./app');
// const socketIo = require('socket.io');
// const dotenv = require('dotenv');

// dotenv.config();

// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('send_message', (message) => {
//     io.emit('receive_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error('Database connection error:', err));


// const http = require('http');
// const mongoose = require('mongoose');
// const app = require('./app');
// const socketIo = require('socket.io');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// // Middleware for CORS
// app.use(cors());
// app.use(cors({ origin: 'http://localhost:5175', credentials: true }));

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:5175', // Allow the frontend origin
//     methods: ['GET', 'POST'],        // Allow necessary methods
//     credentials: true                // Allow cookies and authorization headers
//   },
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('send_message', (message) => {
//     io.emit('receive_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error('Database connection error:', err));










// const http = require('http');
// const mongoose = require('mongoose');
// const app = require('./app');
// const socketIo = require('socket.io');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// // Middleware for CORS
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both origins
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

// app.use(cors(corsOptions)); // Apply the CORS middleware

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both origins
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('send_message', (message) => {
//     io.emit('receive_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error('Database connection error:', err));




const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const Message = require('./models/Message'); // Import Message model

dotenv.config();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store active connections
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user/admin connection
  socket.on('register', (userId) => {
    activeConnections.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle message sending
  socket.on('send_message', async (messageData) => {
    try {
      // Validate messageData
      if (!messageData.senderId || !messageData.receiverId || !messageData.content) {
        throw new Error('Invalid message data');
      }

      // Save message to database
      const message = new Message({
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.content,
        attachment: messageData.attachment || null, // Default to null if no attachment
      });
      await message.save();

      // Find recipient's socket
      const recipientSocketId = activeConnections.get(messageData.receiverId);

      if (recipientSocketId) {
        // Send message directly to recipient's socket
        io.to(recipientSocketId).emit('receive_message', message);
      } else {
        console.log(`Recipient ${messageData.receiverId} is not online.`);
      }

      console.log('Message sent:', message);
    } catch (error) {
      console.error('Message sending error:', error);
      socket.emit('error_message', { error: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (let [userId, socketId] of activeConnections.entries()) {
      if (socketId === socket.id) {
        activeConnections.delete(userId);
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  });
});

// Make io available in the app
app.set('io', io);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));
