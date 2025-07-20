let tabla; 
let rutBuscado = ''; 

document.addEventListener('DOMContentLoaded', () => {
  tabla = $('#tablaAlumnos').DataTable({
  language: {
    lengthMenu: "Mostrar _MENU_ registros",
    search: "Buscar:",
    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
    paginate: {
      previous: "Anterior",
      next: "Siguiente"
    },
    zeroRecords: "No se encontraron resultados",
    infoEmpty: "Mostrando 0 a 0 de 0 registros",
    infoFiltered: "(filtrado de _MAX_ registros totales)"
  },
  columnDefs: [
    { targets: 0, width: "120px" },
    { targets: 1, width: "100px" },
    { targets: 2, width: "100px" },
    { targets: 3, width: "100px" },
    { targets: 4, width: "100px" },
    { targets: 5, width: "120px" },
    { targets: 6, width: "120px" },
    { targets: 7, width: "100px" }
  ]
});

  cargarAlumnos();

  document.getElementById('formAlumno').addEventListener('submit', insertarAlumno);
  document.getElementById('modificarForm').addEventListener('submit', actualizarAlumno);
});

async function cargarAlumnos() {
  const res = await fetch('/alumnos');
  const alumnos = await res.json();

  tabla.clear();
  alumnos.forEach(a => {
    tabla.row.add([
      a.rut,
      a.nombres,
      a.apellido_paterno,
      a.apellido_materno,
      a.fecha_nacimiento ? a.fecha_nacimiento.split('T')[0] : '',
      a.direccion || '',
      a.ciudad || '',
      `<button onclick="buscarAlumno('${a.rut}')">✏️ Editar</button>`
    ]);
  });
  tabla.draw();
}

async function insertarAlumno(e) {
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
    document.getElementById('formAlumno').reset();
    ocultarFormularioInsertar();
    cargarAlumnos();
  } else {
    alert('Error al insertar alumno');
  }
}

async function buscarAlumno(rut) {
  rutBuscado = rut;

  const res = await fetch(`/alumnos/${rut}`);
  if (res.ok) {
    const alumno = await res.json();

    document.getElementById('mod_nombres').value = alumno.nombres;
    document.getElementById('mod_apellido_paterno').value = alumno.apellido_paterno;
    document.getElementById('mod_apellido_materno').value = alumno.apellido_materno;
    document.getElementById('mod_fecha_nacimiento').value = alumno.fecha_nacimiento.split('T')[0];
    document.getElementById('mod_direccion').value = alumno.direccion || '';
    document.getElementById('mod_ciudad').value = alumno.ciudad || '';

    mostrarFormularioModificar();
  } else {
    alert('Alumno no encontrado');
  }
}

async function actualizarAlumno(e) {
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
    ocultarFormularioModificar();
    cargarAlumnos();
  } else {
    alert('Error al actualizar alumno');
  }
}

function mostrarFormularioInsertar() {
  document.getElementById('formAlumno').style.display = 'block';
}

function ocultarFormularioInsertar() {
  document.getElementById('formAlumno').style.display = 'none';
}

function mostrarFormularioModificar() {
  document.getElementById('modificarForm').style.display = 'block';
}

function ocultarFormularioModificar() {
  document.getElementById('modificarForm').style.display = 'none';
}
