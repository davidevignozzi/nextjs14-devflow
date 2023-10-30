import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true); // is going to prevent unknown field queries

  if (!process.env.MONGODB_URL) {
    return console.error('⛔ Missing MONGODB_URL ⛔');
  }

  if (isConnected) {
    return console.log('🍃 MongoDB is already connected 🍃');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName: 'devflow' });

    isConnected = true;

    console.log('🍃 MongoDB is connected 🍃');
  } catch (error) {
    console.error(`❌ ${error} ❌`);
  }
};
