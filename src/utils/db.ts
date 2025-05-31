import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Ensure the URI points to the correct database
    if (!mongoUri.includes('prompt_db')) {
      mongoUri = mongoUri.replace('/?', '/prompt_db?');
    }

    logger.info('Attempting to connect to MongoDB with URI:', { 
      uri: mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@') // Hide credentials in logs
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    logger.info('MongoDB connected successfully');
    
    // Listen for connection errors
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', { 
        error: error.message,
        stack: error.stack,
        name: error.name
      });
    });

    // Listen for disconnection
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Listen for reconnection
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error: any) {
    logger.error('MongoDB connection error:', { 
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      return connectDB(retryCount + 1);
    } else {
      logger.error('Failed to connect to MongoDB after maximum retries');
      process.exit(1);
    }
  }
};

export default connectDB; 