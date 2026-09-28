import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// // Health check endpoint
// app.get('/api/health', (_req, res) => {
//   res.json({
//     status: 'ok',
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//     timestamp: new Date().toISOString(),
//   });
// });

app.get('/', (_req, res) => {
  res.send('TodoTracker Backend API is running.');
});

// Centralized error handling
app.use(errorHandler);

export default app;
