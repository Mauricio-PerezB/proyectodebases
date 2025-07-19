const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Insertar datos (punto 3)
app.post('/insert', async (req, res) => {
  const { nombre, edad } = req.body;
  await pool.query('INSERT INTO personas(nombre, edad) VALUES($1, $2)', [nombre, edad]);
  res.send('Datos insertados');
});

// Modificar datos (punto 4)
app.put('/update', async (req, res) => {
  const { id, nombre, edad } = req.body;
  await pool.query('UPDATE personas SET nombre=$1, edad=$2 WHERE id=$3', [nombre, edad, id]);
  res.send('Datos modificados');
});

// Consultar datos (punto 5)
app.get('/consulta', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en consulta:', error);
    res.status(500).send('Error en consulta');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
