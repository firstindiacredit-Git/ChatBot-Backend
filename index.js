
// const http = require('http');
// const mongoose = require('mongoose'); 
// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const dotenv = require('dotenv');

// // Importing routes
// const authRoutes = require('./routes/authRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware for JSON parsing and CORS
// app.use(express.json());
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:5174' , 'https://chatbot-user.vercel.app','https://chatbot-admin-iota.vercel.app'], // Allow both admin and user apps
//   credentials: true,
// };
// app.use(cors(corsOptions));  

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api', authRoutes);
// app.use('/api', chatRoutes);
// app.use('/api',serviceRoutes);
// app.use('/api',propertyRoutes);
// app.get("/", (req, res) => {
//   res.send("Welcome to chatapp backend");
// });

// // Create HTTP server and attach Socket.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:5173', 'http://localhost:5174','https://chatbot-user.vercel.app','https://chatbot-admin-iota.vercel.app'], // Allow both admin and user origins
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// const liveUsers = new Map(); // Using Map to store userId and websiteId as key-value pairs
// global.liveUsers = liveUsers;

// // Socket.IO Event Handlers
// io.on('connection', (socket) => {
//    console.log('A user connected:', socket.id);

//   // Handle user joining a unique room
//   socket.on('join_room', (userId, websiteId) => {
//     if (userId && websiteId) {
//       socket.join(userId); // Join room with user ID
//       global.liveUsers.set(userId, { websiteId, socketId: socket.id });
//       console.log(`User ${userId} joined room ${userId} with websiteId ${websiteId}`);
//     }
//   });

//   // Handle sending messages
//   socket.on('send_message', (message) => {
//     const { senderId, receiverId, content } = message;


//     // // Basic validation
//     // if (!senderId || !receiverId || !content.trim()) {
//     //   console.error('Invalid message data:', message);
//     //   return;
//     // }

//     // Basic validation
//     if (!senderId || !receiverId || (!content?.trim() && !message.attachment)) {
//       // console.error('Invalid message data:', message);
//       return;
//   }

//     // Emit the message to the receiver's room
//     io.to(receiverId).emit('receive_message', message);
//     //  console.log(`Message from ${senderId} to ${receiverId}: ${content ||'Attachment'}`);
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     // Find and remove the disconnected user from liveUsers
//     for (const [userId, userData] of global.liveUsers.entries()) {
//       if (userData.socketId === socket.id) {
//         global.liveUsers.delete(userId);
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });

// // MongoDB Connection and Server Start
// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
const serviceRoutes = require('./routes/serviceRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for JSON parsing and CORS
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174' , 'https://chatbot-user.vercel.app','https://chatbot-admin-iota.vercel.app'], // Allow both admin and user apps
  credentials: true,
};
app.use(cors(corsOptions));  

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api',serviceRoutes);
app.use('/api',propertyRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to chatapp backend");
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174','https://chatbot-user.vercel.app','https://chatbot-admin-iota.vercel.app'], // Allow both admin and user origins
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const liveUsers = new Set();
global.liveUsers = liveUsers;

// const liveUsers = new Map(); // Using Map to store userId and websiteId as key-value pairs
// global.liveUsers = liveUsers;

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  //  console.log('A user connected:', socket.id);

  // Handle user joining a unique room
  socket.on('join_room', (userId,websiteId) => {
    if (userId) {
      socket.join(userId); // Join room with user ID
      global.liveUsers.add(userId,websiteId);
      // console.log(`User ${userId} joined room ${userId} with websiteId ${websiteId}`);
    }
  });

  // socket.on('join_room', (userId, websiteId) => {
  //   if (userId && websiteId) {
  //     socket.join(userId); // User joins a room identified by their userId
  //     global.liveUsers.set(userId, websiteId); // Add userId and websiteId to the Map
  //     console.log(`User ${userId} joined room with websiteId ${websiteId}`);
  //   }
  // });
  

  

  // Handle sending messages
  socket.on('send_message', (message) => {
    const { senderId, receiverId, content } = message;


    // // Basic validation
    // if (!senderId || !receiverId || !content.trim()) {
    //   console.error('Invalid message data:', message);
    //   return;
    // }

    // Basic validation
    if (!senderId || !receiverId || (!content?.trim() && !message.attachment)) {
      // console.error('Invalid message data:', message);
      return;
  }

    // Emit the message to the receiver's room
    io.to(receiverId).emit('receive_message', message);
    //  console.log(`Message from ${senderId} to ${receiverId}: ${content ||'Attachment'}`);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    liveUsers.forEach((user) => {
      if (io.sockets.adapter.rooms.get(user.userId)?.size === 0) {
        global.liveUsers.delete(user); // Remove from live users if no sockets remain
        // console.log(`User ${user.userId} removed from live users on disconnect`);
      }
    });
    //  console.log('User disconnected:', socket.id);
    //  console.log('Current live users after disconnect:', Array.from(liveUsers));
  });


  // socket.on('disconnect', () => {
  //   global.liveUsers.forEach((websiteId, userId) => {
  //     if (!io.sockets.adapter.rooms.has(userId)) { 
  //       global.liveUsers.delete(userId); // Remove from live users if no active sockets remain
  //       console.log(`User ${userId} removed from live users`);
  //     }
  //   });
  //   console.log('User disconnected:', socket.id);
  //   console.log('Current live users:', Array.from(global.liveUsers.entries()));
  // });
  
 
  // Handle user disconnecting
//   socket.on('disconnect', () => {
//   // Check if the user is in the liveUsers set
//   if (liveUsers.has(socket.id)) {
//     liveUsers.delete(socket.id); // Remove the user from live users
//     console.log('User disconnected:', socket.id);
//   }
// });

});





// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

 

