  const express = require('express');
  const { body, validationResult } = require('express-validator');
  const sqlite3 = require('sqlite3').verbose();

  const app = express();
  app.use(express.json());

  const db = new sqlite3.Database(':memory:');

  db.serialize(() => {
    db.run('CREATE TABLE agendamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT, hora TEXT, paciente TEXT, medico TEXT, status TEXT)');
  });

  app.post('/agendamentos', [
    body('data').isDate(),
    body('hora').isLength({ min: 5, max: 5 }),
    body('paciente').isLength({ min: 3 }),
    body('medico').isLength({ min: 3 }),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { data, hora, paciente, medico } = req.body;

    db.get('SELECT * FROM agendamentos WHERE data = ? AND hora = ?', [data, hora], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        return res.status(409).json({ error: 'Já existe uma consulta agendada para esta data e hora.' });
      }

      db.run('INSERT INTO agendamentos (data, hora, paciente, medico, status) VALUES (?, ?, ?, ?, ?)', [data, hora, paciente, medico, 'marcado'], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ id: this.lastID });
      });
    });
  });

  app.get('/agendamentos', (req, res) => {
    db.all('SELECT * FROM agendamentos', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    });
  });

  app.delete('/agendamentos/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM agendamentos WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: 'Consulta não encontrada.' });
      }

      db.run('UPDATE agendamentos SET status = ? WHERE id = ?', ['cancelado', id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Consulta cancelada com sucesso.' });
      });
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}.`);
  });
