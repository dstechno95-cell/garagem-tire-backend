require('dotenv').config();

const express = require('express');
const cors = require('cors');

const tireSearchRoutes = require('./routes/tireSearch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check — Render usa isso para saber se o serviço está vivo
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tires', tireSearchRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Garagem Pro Tire Search API rodando na porta ${PORT}`);
});
