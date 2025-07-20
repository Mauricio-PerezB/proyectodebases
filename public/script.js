const form = document.getElementById('formAlumno');
const lista = document.getElementById('listaAlumnos');
const buscarForm = document.getElementById('buscarForm');
const modificarForm = document.getElementById('modificarForm');
let rutBuscado = ''; // guardamos el rut del alumno que estamos editando

// Insertar alumno
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const alumno = {
    rut: document.getElementById('rut').value,
    nombres: document.getElementById('nombres').value,
    apellido_paterno: document.getElementById('apellido_paterno').value,
    apellido_materno: document.getElementById('apellido_materno').value,
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
    direccion: document.getElementById('direccion').value,
    ciudad: document.getElementById('ciudad').value,
  };

  const res = await fetch('/alumnos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno),
  });

  if (res.ok) {
    alert('Alumno insertado correctamente');
    form.reset();
    consultarAlumnos();
  } else {
    alert('Error al insertar alumno');
  }
});

// Consultar todos los alumnos
async function consultarAlumnos() {
  const res = await fetch('/alumnos');
  const alumnos = await res.json();

  lista.innerHTML = '';
  alumnos.forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.rut} - ${a.nombres} ${a.apellido_paterno} ${a.apellido_materno}`;
    lista.appendChild(li);
  });
}

// Buscar alumno por rut
buscarForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  rutBuscado = document.getElementById('buscarRut').value;

  const res = await fetch(`/alumnos/${rutBuscado}`);
  if (res.ok) {
    const alumno = await res.json();

    // Rellenamos el formulario de modificar
    document.getElementById('mod_nombres').value = alumno.nombres;
    document.getElementById('mod_apellido_paterno').value = alumno.apellido_paterno;
    document.getElementById('mod_apellido_materno').value = alumno.apellido_materno;
    document.getElementById('mod_fecha_nacimiento').value = alumno.fecha_nacimiento.split('T')[0];
    document.getElementById('mod_direccion').value = alumno.direccion || '';
    document.getElementById('mod_ciudad').value = alumno.ciudad || '';

    modificarForm.style.display = 'block';
  } else {
    alert('Alumno no encontrado');
    modificarForm.style.display = 'none';
  }
});

// Actualizar alumno
modificarForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const alumnoActualizado = {
    nombres: document.getElementById('mod_nombres').value,
    apellido_paterno: document.getElementById('mod_apellido_paterno').value,
    apellido_materno: document.getElementById('mod_apellido_materno').value,
    fecha_nacimiento: document.getElementById('mod_fecha_nacimiento').value,
    direccion: document.getElementById('mod_direccion').value,
    ciudad: document.getElementById('mod_ciudad').value,
  };

  const res = await fetch(`/alumnos/${rutBuscado}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumnoActualizado),
  });

  if (res.ok) {
    alert('Alumno actualizado correctamente');
    modificarForm.style.display = 'none';
    consultarAlumnos();
  } else {
    alert('Error al actualizar alumno');
  }
});
