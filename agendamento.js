const express = require('express');
const router = express.Router();
const db = require('../db');
const { check, validationResult } = require('express-validator');


router.post('/agendar', [
  check('data').isDate(),
  check('hora').isISO8601(),
  check('paciente').isString(),
  check('medico').isString(),
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { data, hora, paciente, medico } = req.body;


  const status = 'marcado';

  db.run('INSERT INTO appointments (data, hora, paciente, medico, status) VALUES (?, ?, ?, ?, ?)', [data, hora, paciente, medico, status], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao agendar a consulta' });
    }
    res.status(201).json({ message: 'Consulta agendada com sucesso' });
  });
});

router.get('/listar', (req, res) => {
  db.all('SELECT * FROM appointments', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar as consultas agendadas' });
    }
    res.json(rows);
  });
});

router.delete('/cancelar/:id', (req, res) => {
  const idConsulta = req.params.id;

  db.run('UPDATE appointments SET status = "cancelado" WHERE id = ?', [idConsulta], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao cancelar a consulta' });
    }
    res.json({ message: 'Consulta cancelada com sucesso' });
  });
});

module.exports = router;
