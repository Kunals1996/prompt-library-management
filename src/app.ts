import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promptRoutes from './routes/prompt.routes';
import connectDB from './utils/db';
import logger from './utils/logger';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prompts', promptRoutes);

// Error handling middleware
app.use(errorHandler);

let server: any;

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Close HTTP server
  if (server) {
    logger.info('Closing HTTP server...');
    await new Promise((resolve) => {
      server.close(() => {
        logger.info('HTTP server closed');
        resolve(true);
      });
    });
  }

  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    logger.info('Closing MongoDB connection...');
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (err) {
      logger.error('Error closing MongoDB connection:', err);
    }
  }

  // Exit process
  logger.info('Graceful shutdown completed');
  process.exit(0);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('Uncaught Exception');
});

// Database connection and server start
connectDB().then(() => {
  server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}); 