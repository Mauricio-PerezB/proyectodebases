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

  // Eventos para insertar y actualizar
  const formAlumno = document.getElementById('formAlumno');
  if (formAlumno) {
    formAlumno.addEventListener('submit', insertarAlumno);
  }

  const formModificar = document.getElementById('modificarForm');
  if (formModificar) {
    formModificar.addEventListener('submit', actualizarAlumno);
  }

  // Botones para mostrar/ocultar modal
  const btnCrear = document.getElementById('btnCrearAlumno');
  if (btnCrear) {
    btnCrear.addEventListener('click', mostrarFormularioInsertar);
  }

  const btnRegresar = document.getElementById('btnRegresar');
  if (btnRegresar) {
    btnRegresar.addEventListener('click', ocultarFormularioInsertar);
  }

  // También cerrar modal si hacen click en el overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', ocultarFormularioInsertar);
  }

  const btnCancelarModificar = document.getElementById('btnCancelarModificar');
  if (btnCancelarModificar) {
    btnCancelarModificar.addEventListener('click', ocultarFormularioModificar);
  }
});

// Cargar alumnos en la tabla
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

// Insertar alumno
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

// Actualizar alumno
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

// Mostrar modal insertar
function mostrarFormularioInsertar() {
  document.getElementById('modalFormulario').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

// Ocultar modal insertar
function ocultarFormularioInsertar() {
  document.getElementById('modalFormulario').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function mostrarFormularioModificar() {
  document.getElementById('modalModificar').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function ocultarFormularioModificar() {
  document.getElementById('modalModificar').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
