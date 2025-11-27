import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/neuralprep_test'
  : process.env.MONGODB_URI || 'mongodb://localhost:27017/neuralprep';

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.info('Database already connected');
      return;
    }

    await mongoose.connect(MONGODB_URI);

    console.info('✅ Database connected successfully');
    console.info(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.info('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

mongoose.connection.on('connected', () => {
  console.info('📡 MongoDB connected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.info('🔌 MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

export default mongoose;