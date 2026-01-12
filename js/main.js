// Manejo de tiradas de dados
document.getElementById('tirar-dado')?.addEventListener('click', () => {
  const dado = parseInt(document.getElementById('tipo-dado').value);
  const resultado = Math.floor(Math.random() * dado) + 1;
  document.getElementById('resultado-dado').textContent = resultado;
});

// Cargar partidas/personajes en home
const listaPartidasHome = document.getElementById('lista-partidas');
if (listaPartidasHome) {
  let personajes = JSON.parse(localStorage.getItem('personajes')) || [];
  personajes.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${p.nombre} - ${p.clase}`;
    listaPartidasHome.appendChild(li);
  });
}
// Tiradas de atributos (8D20)
document.getElementById('tirar-atributos')?.addEventListener('click', () => {
  const tiradas = [];
  for (let i = 0; i < 8; i++) {
    tiradas.push(Math.floor(Math.random() * 20) + 1);
  }
  const contenedor = document.getElementById('valores-tirados');
  contenedor.innerHTML = 'Resultados: ' + tiradas.join(', ') + '<br><small>Asigna estos valores a tus atributos.</small>';
});
// Función para obtener imagen por defecto según la clase
function getImagenPorClase(clase) {
  const imagenesPorClase = {
    guerrero: 'assets/default-guerrero.png',
    mago: 'assets/default-mago.png',
    paladin: 'assets/default-paladin.png',
    brujo: 'assets/default-brujo.png',
    pícaro: 'assets/default-pícaro.png',
    explorador: 'assets/default-explorador.png',
    bárbaro: 'assets/default-bárbaro.png'
  };
  return imagenesPorClase[clase] || 'assets/default-character.png';
}

// Previsualización inicial según la clase seleccionada
const claseSelect = document.getElementById('clase');
const preview = document.getElementById('preview-imagen');
if (preview && claseSelect) {
  preview.src = getImagenPorClase(claseSelect.value);
}

// Cambiar imagen de previsualización al cambiar la clase (si no se sube imagen)
claseSelect?.addEventListener('change', () => {
  if (!inputImagen.files[0]) { // Solo cambia si el usuario no subió imagen
    preview.src = getImagenPorClase(claseSelect.value);
  }
});

// Previsualizar imagen subida
const inputImagen = document.getElementById('imagen');
inputImagen?.addEventListener('change', () => {
  const file = inputImagen.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result; // Imagen subida reemplaza la por defecto
    }
    reader.readAsDataURL(file);
  } else {
    preview.src = getImagenPorClase(claseSelect.value); // Volver a imagen por clase si elimina archivo
  }
});

// Guardar personaje con imagen según clase si no se sube
document.getElementById('form-personaje')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  let imagenPersonaje;
  if (inputImagen.files[0]) {
    const reader = new FileReader();
    imagenPersonaje = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(inputImagen.files[0]);
    });
  } else {
    imagenPersonaje = getImagenPorClase(claseSelect.value);
  }

  const personaje = {
    nombre: document.getElementById('nombre').value,
    clase: claseSelect.value,
    fuerza: document.getElementById('fuerza').value,
    destreza: document.getElementById('destreza').value,
    constitucion: document.getElementById('constitucion').value,
    inteligencia: document.getElementById('inteligencia').value,
    sabiduria: document.getElementById('sabiduria').value,
    carisma: document.getElementById('carisma').value,
    imagen: imagenPersonaje,
    trasfondo: document.getElementById('trasfondo').value,
    inventario: [],
    conjuros: []
  };

  let personajes = JSON.parse(localStorage.getItem('personajes')) || [];
  personajes.push(personaje);
  localStorage.setItem('personajes', JSON.stringify(personajes));
  alert('Personaje guardado!');
  window.location.href = 'index.html';
});
function mostrarPersonajes() {
    const contenedor = document.getElementById('cards-personajes');
    if(!contenedor) return;

    const personajes = JSON.parse(localStorage.getItem('personajes')) || [];
    contenedor.innerHTML = '';

    personajes.forEach((p, index) => {
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="card mb-3 position-relative" style="cursor:pointer;" data-index="${index}" data-bs-toggle="modal" data-bs-target="#modalPersonaje">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${p.imagen}" class="img-fluid rounded-start" alt="${p.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${p.nombre} - ${p.clase}</h5>
                            <p class="card-text mb-1"><strong>Fuerza:</strong> ${p.fuerza} | <strong>Destreza:</strong> ${p.destreza}</p>
                            <p class="card-text mb-1"><strong>Constitución:</strong> ${p.constitucion} | <strong>Inteligencia:</strong> ${p.inteligencia}</p>
                            <p class="card-text mb-1"><strong>Sabiduría:</strong> ${p.sabiduria} | <strong>Carisma:</strong> ${p.carisma}</p>
                        </div>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm position-absolute bottom-0 end-0 m-2 eliminar-btn">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(col);
    });

    // Evento click para mostrar modal con detalles
    document.querySelectorAll('#cards-personajes .card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Evitar abrir modal si se clickea el botón de eliminar
            if(e.target.classList.contains('eliminar-btn')) return;

            const index = card.getAttribute('data-index');
            const personaje = personajes[index];
            const detalle = document.getElementById('detalle-personaje');
            detalle.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${personaje.imagen}" class="img-fluid rounded" alt="${personaje.nombre}">
                    </div>
                    <div class="col-md-8">
                        <h3>${personaje.nombre} - ${personaje.clase}</h3>
                        <p><strong>Trasfondo:</strong> ${personaje.trasfondo || 'Sin trasfondo'}</p>
                        <p><strong>Fuerza:</strong> ${personaje.fuerza} | <strong>Destreza:</strong> ${personaje.destreza}</p>
                        <p><strong>Constitución:</strong> ${personaje.constitucion} | <strong>Inteligencia:</strong> ${personaje.inteligencia}</p>
                        <p><strong>Sabiduría:</strong> ${personaje.sabiduria} | <strong>Carisma:</strong> ${personaje.carisma}</p>
                        <p><strong>Inventario:</strong> ${personaje.inventario.length ? personaje.inventario.join(', ') : 'Vacío'}</p>
                        <p><strong>Conjuros:</strong> ${personaje.conjuros.length ? personaje.conjuros.join(', ') : 'Ninguno'}</p>
                    </div>
                </div>
            `;
        });
    });

    // Evento click para eliminar personaje
    document.querySelectorAll('.eliminar-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar abrir modal al eliminar
            const card = btn.closest('.card');
            const index = card.getAttribute('data-index');
            personajes.splice(index, 1);
            localStorage.setItem('personajes', JSON.stringify(personajes));
            mostrarPersonajes(); // Volver a renderizar cards
        });
    });
}
 // Cargar personajes en el select
    const selectPersonaje = document.getElementById('seleccion-personaje');
    const personajes = JSON.parse(localStorage.getItem('personajes')) || [];
    personajes.forEach((p, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${p.nombre} - ${p.clase}`;
        selectPersonaje.appendChild(option);
    });

    // Iniciar nueva partida
    document.getElementById('nueva-partida').addEventListener('click', () => {
        const index = selectPersonaje.value;
        const personaje = personajes[index];
        if(!personaje){
            alert("Selecciona un personaje válido");
            return;
        }

        // Crear partida en localStorage
        const partidas = JSON.parse(localStorage.getItem('partidas')) || [];
        const nuevaPartida = {
            id: Date.now(),
            personaje,
            mensajes: [] // Aquí se guardarán los mensajes de la IA y jugador
        };
        partidas.push(nuevaPartida);
        localStorage.setItem('partidas', JSON.stringify(partidas));

        // Ir a la página de partida
        window.location.href = `partida.html?id=${nuevaPartida.id}`;
    });

    // Cargar partidas existentes
    const listaPartidasGuardadas = document.getElementById('partidas-guardadas');
    const partidas = JSON.parse(localStorage.getItem('partidas')) || [];
    partidas.forEach((p) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${p.personaje.nombre} - ${p.personaje.clase}`;
        const btn = document.createElement('button');
        btn.className = "btn btn-primary btn-sm";
        btn.textContent = "Continuar";
        btn.addEventListener('click', () => {
            window.location.href = `partida.html?id=${p.id}`;
        });
        li.appendChild(btn);
        listaPartidasGuardadas.appendChild(li);
    });


