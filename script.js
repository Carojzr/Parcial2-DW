// Referencias a los elementos del DOM
const errorContainer = document.querySelector('.containerError');
const pokemonType = document.querySelector('.pokemonType');
const infoPokemon = document.querySelector('.containerInfo');
const evolutionContainer = document.querySelector('.containerEvolution');
const pokemonName = document.querySelector('.pokemonName');
const pokemonDescrition = document.querySelector('.pokemonDescrition');
const evolutionButton = document.querySelector('.buttonEvolution');
const pokemonAbilities = document.querySelector('.pokemonAbilities');
const pokemonImg = document.querySelector('.pokemonImg');
const searchButton = document.querySelector('.buttonSearch');

// Manejador de eventos para el botón de evolucionar
evolutionButton.addEventListener("click", async () => {
    const evolutionPokemon = localStorage.getItem("pokeEvolve");
    if (evolutionPokemon) {
        await resultados(evolutionPokemon);
    } else {
        console.log("No hay información de evolución disponible.");
    }
});

// Manejador de eventos para el botón de búsqueda
searchButton.addEventListener("click", async () => {
    const pokemonNameInput = document.getElementById('in1').value;
    try {
        await resultados(pokemonNameInput);
    } catch (error) {
        console.error('Error al buscar el Pokémon:', error);
        // Mostrar el contenedor de error si la búsqueda falla
        errorContainer.style.display = 'block';
        // Ocultar otros contenedores
        infoPokemon.style.display = 'none';
        evolutionContainer.style.display = 'none';
    }
});

// Función para realizar la consulta a la API de Pokémon
async function consultarAPI(url, nombre) {
    try {
        const response = await axios.get(url + nombre);
        return response.data;
    } catch (error) {
        console.error(`Error de la API: ${error}`);
        throw error;
    }
}

// Función para mostrar los resultados en la interfaz
async function resultados(nombrePokemon) {
    // Llamada a la función para obtener los resultados
    const resultadosPokemon = await consultarAPI('https://pokeapi.co/api/v2/pokemon/', nombrePokemon);

    // Verificar si hay resultados y si el nombre no está vacío
    const hayResultados = resultadosPokemon && nombrePokemon !== '';

    // Mostrar u ocultar los elementos según el estado 
    errorContainer.style.display = hayResultados ? 'none' : 'block';
    infoPokemon.style.display = hayResultados ? 'block' : 'none';
    evolutionContainer.style.display = hayResultados ? 'block' : 'none';

    // Obtener imagen
    pokemonName.textContent = resultadosPokemon.name;
    pokemonImg.src = resultadosPokemon.sprites.other["official-artwork"].front_default;

    const tipos = resultadosPokemon.types.map(type => type.type.name).join(', ');
    pokemonType.textContent = tipos;

    // Obtener las habilidades
    const habilidades = resultadosPokemon.abilities.map(ability => ability.ability.name).join(', ');
    pokemonAbilities.textContent = habilidades;

    const idPokemon = resultadosPokemon.id;

    // Obtener la descripción 
    const descripcionPokemon = await consultarAPI('https://pokeapi.co/api/v2/pokemon-species/', idPokemon);
    pokemonDescrition.textContent = descripcionPokemon.flavor_text_entries.find(entry => entry.language.name === "es").flavor_text;

    // Mostrar el botón de evolución si hay una próxima evolución
    const urlEvolucion = descripcionPokemon.evolution_chain.url;
    const evolucionPokemon = await consultarAPI(urlEvolucion, '');
    localStorage.clear();

    if (evolucionPokemon.chain.evolves_to[0]) {
        evolutionButton.style.display = 'block';
        localStorage.setItem("pokeEvolve", evolucionPokemon.chain.evolves_to[0].species.name);
    } else {
        evolutionButton.style.display = 'none';
    }
}
