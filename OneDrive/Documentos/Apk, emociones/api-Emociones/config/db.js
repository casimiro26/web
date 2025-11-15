import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas (emociones)');
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    process.exit(1);
  }
};

export default connectDB;