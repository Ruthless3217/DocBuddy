/**
 * MongoDB Database Connection
 * Uses Mongoose with connection pooling and retry logic
 */

const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const options = {
    maxPoolSize: 10,          // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected successfully');
});

module.exports = connectDB;
