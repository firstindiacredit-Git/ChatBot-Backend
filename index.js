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










const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Importing routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for JSON parsing and CORS
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both admin and user apps
  credentials: true,
};
app.use(cors(corsOptions));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to chatapp backend");
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both admin and user origins
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining a unique room
  socket.on('join_room', (userId) => {
    if (userId) {
      socket.join(userId); // Join room with user ID
      console.log(`User ${userId} joined room ${userId}`);
    }
  });

  // Handle sending messages
  socket.on('send_message', (message) => {
    const { senderId, receiverId, content } = message;


    // Basic validation
    if (!senderId || !receiverId || !content.trim()) {
      console.error('Invalid message data:', message);
      return;
    }

    // Emit the message to the receiver's room
    io.to(receiverId).emit('receive_message', message);
    console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));



















