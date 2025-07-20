import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const pool = new pg.Pool({
  user: 'rleyva',
  host: 'pgsqltrans.face.ubiobio.cl',
  database: 'rleyva_bd',
  password: 'pass123',
  port: 5432,
});

app.post('/alumnos', async (req, res) => {
  const { rut, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, ciudad } = req.body;
  try {
    const query = `
      INSERT INTO alumno (rut, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, ciudad)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [rut, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, ciudad]);
    res.status(201).json({ mensaje: 'Alumno insertado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar alumno' });
  }
});

app.get('/alumnos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumno');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar alumnos' });
  }
});

app.get('/alumnos/:rut', async (req, res) => {
  const rut = req.params.rut;
  try {
    const result = await pool.query('SELECT * FROM alumno WHERE rut=$1', [rut]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar alumno' });
  }
});

app.put('/alumnos/:rut', async (req, res) => {
  const rut = req.params.rut;
  const { nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, ciudad } = req.body;
  try {
    const query = `
      UPDATE alumno
      SET nombres=$1, apellido_paterno=$2, apellido_materno=$3, fecha_nacimiento=$4, direccion=$5, ciudad=$6
      WHERE rut=$7
    `;
    const result = await pool.query(query, [nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, ciudad, rut]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado para actualizar' });
    }

    res.json({ mensaje: 'Alumno actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar alumno' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
