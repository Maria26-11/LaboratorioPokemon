const btnGuardar = document.getElementById('btnGuardar');
const btnBuscar = document.getElementById('btnBuscar');
const btnListar = document.getElementById('btnListar');
const btnActualizar = document.getElementById('btnActualizar');
const btnEliminar = document.getElementById('btnEliminar');

const inputNombrePokemon = document.getElementById('pokemonName');
const sectionInfoPokemon = document.getElementById('infoPokemon');
const listaPokemon = document.getElementById('listaPokemon');

const URL_API = "http://127.0.0.1/LaboratorioPokemon/api_pokemon.php";

let pokemonActual = null;
let idPokemonSeleccionado = null;

btnBuscar.addEventListener('click', () => {
    buscarPokemon(inputNombrePokemon.value.toLowerCase());
});

btnGuardar.addEventListener('click', () => {
    guardarPokemon();
});

btnListar.addEventListener('click', () => {
    listarPokemones();
});

btnActualizar.addEventListener('click', () => {
    abrirModalActualizar();
});

btnEliminar.addEventListener('click', () => {
    eliminarPokemon();
});

async function buscarPokemon(nombre) {
    if (nombre === "") {
        alert("Debe escribir el nombre del Pokémon");
        return;
    }
    sectionInfoPokemon.innerHTML = `<p>Buscando Pokemon...</p>`;
    try {
        const respuestaLista = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
        const datosLista = await respuestaLista.json();
        const resultados = datosLista.results.filter(p =>
            p.name.startsWith(nombre)
        );
        if (resultados.length === 0) {
            sectionInfoPokemon.innerHTML = "<p>No se encontraron Pokémon.</p>";
            return;
        }
        let html = "<h2>Resultados encontrados</h2>";
        resultados.forEach(p => {
            html += `
                <div class="item-pokemon">
                    <p><strong>Nombre:</strong> ${p.name}</p>
                    <button onclick="cargarPokemon('${p.name}')">
                        Ver detalles
                    </button>
                </div>
                <hr>
            `;
        });
        sectionInfoPokemon.innerHTML = html;
    } catch (error) {
        sectionInfoPokemon.innerHTML = '<p>Ocurrió un error al buscar el Pokemon</p>';
        console.log(error);
    }
}

async function cargarPokemon(nombre) {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!respuesta.ok) {
            throw new Error('Pokemon no encontrado');
        }
        const datos = await respuesta.json();
        mostrarInfoPokemon(datos);
    } catch (error) {
        sectionInfoPokemon.innerHTML = '<p>Error al cargar el Pokemon</p>';
    }
}

function mostrarInfoPokemon(datos) {
    pokemonActual = {
        nombre: datos.name,
        tipo: datos.types[0].type.name,
        fuerza: datos.stats[1].base_stat,
        altura: datos.height,
        peso: datos.weight
    };

    idPokemonSeleccionado = null;

    sectionInfoPokemon.innerHTML = `
    <div class="card-pokemon">
        <div class="info">
            <h2>Nombre: ${pokemonActual.nombre}</h2>
            <h2>Tipo: ${pokemonActual.tipo}</h2>
            <h2>Fuerza: ${pokemonActual.fuerza}</h2>
            <h2>Altura: ${pokemonActual.altura}</h2>
            <h2>Peso: ${pokemonActual.peso}</h2>
        </div>
    </div>
    `;

    cambiarColorFondo(pokemonActual.tipo);
}

async function guardarPokemon() {
    if (pokemonActual === null) {
        alert("Primero debe buscar un Pokémon");
        return;
    }

    try {
        console.log("Pokemon enviado:", pokemonActual);

        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pokemonActual)
        });

        const texto = await respuesta.text();
        console.log("Respuesta PHP:", texto);

        const inicioJson = texto.lastIndexOf("{");
        const jsonLimpio = texto.substring(inicioJson);

        const resultado = JSON.parse(jsonLimpio);
        alert(resultado.mensaje);
    } catch (error) {
        alert("Error real: " + error.message);
        console.log(error);
    }
}

async function listarPokemones() {
    try {
        const respuesta = await fetch(URL_API);
        const pokemones = await respuesta.json();

        let html = "<h2>Pokémon guardados</h2>";

        pokemones.forEach(p => {
            html += `
                <div class="item-pokemon">
                    <p><strong>ID:</strong> ${p.id_pokemon}</p>
                    <p><strong>Nombre:</strong> ${p.nombre}</p>
                    <p><strong>Tipo:</strong> ${p.tipo}</p>
                    <p><strong>Fuerza:</strong> ${p.fuerza}</p>
                    <p><strong>Altura:</strong> ${p.altura}</p>
                    <p><strong>Peso:</strong> ${p.peso}</p>
                   <label>
                    Seleccionar 
                  <input type="checkbox" class="checkPokemon" onchange="seleccionarPokemonCheck(this,
                    ${p.id_pokemon}, '${p.nombre}', '${p.tipo}', ${p.fuerza}, ${p.altura}, ${p.peso}
                    )"/>
                    </label>
                </div>
                <hr>
            `;
        });

        listaPokemon.innerHTML = html;

    } catch (error) {
        alert("Error al listar Pokémon");
        console.log(error);
    }
}

function seleccionarPokemon(id, nombre, tipo, fuerza, altura, peso) {
    idPokemonSeleccionado = id;

    pokemonActual = {
        nombre: nombre,
        tipo: tipo,
        fuerza: fuerza,
        altura: altura,
        peso: peso
    };

    sectionInfoPokemon.innerHTML = `
    <div class="card-pokemon">
        <div class="info">
            <h2>ID: ${id}</h2>
            <h2>Nombre: ${nombre}</h2>
            <h2>Tipo: ${tipo}</h2>
            <h2>Fuerza: ${fuerza}</h2>
            <h2>Altura: ${altura}</h2>
            <h2>Peso: ${peso}</h2>
        </div>
    </div>
    `;

    inputNombrePokemon.value = nombre;
    cambiarColorFondo(tipo);
}

function seleccionarPokemonCheck(
    checkbox,
    id,
    nombre,
    tipo,
    fuerza,
    altura,
    peso
) {

    const checks = document.querySelectorAll('.checkPokemon');

    checks.forEach(c => {
        if (c !== checkbox) {
            c.checked = false;
        }
    });

    if (checkbox.checked) {
        seleccionarPokemon(id, nombre, tipo, fuerza, altura, peso);
    } else {
        idPokemonSeleccionado = null;
        pokemonActual = null;
        sectionInfoPokemon.innerHTML =
            "<p>Información del Pokémon</p>";
    }
}

async function eliminarPokemon() {
    if (idPokemonSeleccionado === null) {
        alert("Primero seleccione un Pokémon guardado");
        return;
    }

    try {
        const respuesta = await fetch(`${URL_API}?id=${idPokemonSeleccionado}`, {
            method: "DELETE"
        });

        const resultado = await respuesta.json();
        alert(resultado.mensaje);

        idPokemonSeleccionado = null;
        pokemonActual = null;
        sectionInfoPokemon.innerHTML = "<p>Información de Pokemon</p>";

        listarPokemones();

    } catch (error) {
        alert("Error al eliminar Pokémon");
        console.log(error);
    }
}

function cambiarColorFondo(tipoPokemon) {
    document.body.classList.remove('agua', 'fuego', 'electrico');

    if (tipoPokemon === "water") {
        document.body.classList.add('agua');
    } else if (tipoPokemon === "fire") {
        document.body.classList.add('fuego');
    } else if (tipoPokemon === "electric") {
        document.body.classList.add('electrico');
    }
}