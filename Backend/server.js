import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/db/db.js';

const PORT = process.env.PORT || 3000;

// Connect to Database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] TodoTracker API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[Server] Failed to start server:', err.message);
  });
