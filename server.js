import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
import documentRoutes from './routes/docroute.js';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000', credentials: true } });

connectDB();

app.use(cors({ origin: 'http://127.0.0.1:5501', credentials: true }));
app.use(express.json());

app.use(session({
  secret: 'collab-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);

io.on('connection', (socket) => {
  console.log('🟢 New client connected');
  socket.on('join-doc', (docId) => {
    socket.join(docId);
    socket.on('doc-changes', (data) => {
      socket.to(docId).emit('doc-updated', data);
    });
  });
  socket.on('disconnect', () => console.log('🔴 Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
