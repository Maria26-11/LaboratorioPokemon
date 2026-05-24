const modalActualizar = document.getElementById('modalActualizar');

const txtNombreActualizar = document.getElementById('txtNombreActualizar');
const txtTipoActualizar = document.getElementById('txtTipoActualizar');
const txtFuerzaActualizar = document.getElementById('txtFuerzaActualizar');
const txtAlturaActualizar = document.getElementById('txtAlturaActualizar');
const txtPesoActualizar = document.getElementById('txtPesoActualizar');

const btnGuardarActualizacion = document.getElementById('btnGuardarActualizacion');
const btnCerrarModal = document.getElementById('btnCerrarModal');


function abrirModalActualizar() {

    if (idPokemonSeleccionado === null || pokemonActual === null) {
        alert("Primero seleccione un Pokémon");
        return;
    }

    txtNombreActualizar.value = pokemonActual.nombre;
    txtTipoActualizar.value = pokemonActual.tipo;
    txtFuerzaActualizar.value = pokemonActual.fuerza;
    txtAlturaActualizar.value = pokemonActual.altura;
    txtPesoActualizar.value = pokemonActual.peso;

    modalActualizar.style.display = "flex";
}

btnCerrarModal.addEventListener('click', () => {
    modalActualizar.style.display = "none";
});

btnGuardarActualizacion.addEventListener('click', async () => {

    const pokemonEditado = {
        id_pokemon: idPokemonSeleccionado,
        nombre: txtNombreActualizar.value,
        tipo: txtTipoActualizar.value,
        fuerza: parseInt(txtFuerzaActualizar.value),
        altura: parseInt(txtAlturaActualizar.value),
        peso: parseInt(txtPesoActualizar.value)
    };

    try {

        const respuesta = await fetch(URL_API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pokemonEditado)
        });

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        modalActualizar.style.display = "none";

        listarPokemones();

    } catch (error) {

        alert("Error al actualizar Pokémon");
        console.log(error);

    }

});