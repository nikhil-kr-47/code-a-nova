import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/code_a_nova';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    // If running in development without a local MongoDB daemon, log clear instruction
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Database Warning] Make sure MongoDB is running locally or specify a valid MONGO_URI in your .env file.');
    }
  }
};
