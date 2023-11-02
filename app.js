const express = require('express');
const app = express();
const db = require('./db');
const appointmentRoutes = require('./routes/appointments');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo ao consultório médico!');
});

app.use('/appointments', appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
