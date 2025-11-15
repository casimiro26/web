import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

app.get('/', (req, res) => {
  res.json({
    message: '¡API de Emociones conectada!',
    status: 'online',
    port: process.env.PORT
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🟢 Servidor en http://localhost:${PORT}`);
});