document.getElementById('formulario').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const edad = document.getElementById('edad').value;

  await fetch('/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, edad }),
  });

  alert('Datos insertados');
});

async function consultar() {
  const res = await fetch('/consulta');
  const data = await res.json();

  const lista = document.getElementById('resultado');
  lista.innerHTML = '';
  data.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `ID: ${p.id}, Nombre: ${p.nombre}, Edad: ${p.edad}`;
    lista.appendChild(li);
  });
}
