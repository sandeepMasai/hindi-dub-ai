
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const videoRoutes = require('./routes/videos');
const paymentRoutes = require('./routes/payments');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =============================
// ✅ CORS Configuration
// =============================
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:3000',
      'https://hindi-dub-ai-1.onrender.com', // ✅ your frontend (Render)
      'https://hindi-dub-ai.onrender.com',   // ✅ optional if backend calls itself
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =============================
// ✅ Routes
// =============================
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check
app.get('/api', (req, res) => {
  res.json({ status: 'OK', message: '🎯 Hindi Dub AI Backend is running successfully!' });
});

// =============================
// ✅ Global Error Handler
// =============================
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥷 Hidden in production' : err.stack,
  });
});

// =============================
// ✅ Server Start
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
