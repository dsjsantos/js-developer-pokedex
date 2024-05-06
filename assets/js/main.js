const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

const pokemonData = {};
const modalDetailId = "modalDetailContainer";
const maxMoves = 5;

function convertPokemonToLi(pokemon) {
    pokemonData[pokemon.name] = pokemon;
    return `
        <li class="pokemon ${pokemon.type}" onclick="openSinglePokenDetail(pokemonData['${pokemon.name}'])">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function openSinglePokenDetail(pokemon) {
    if(pokemon) {
        pokeApi.getSinglePokeonDetail(pokemon.name)
            .then(jsonBody => openDetailModal(pokemon, jsonBody))
    }
}

function buildDetailHTML(pokemon, detail) {
    const moves = detail.moves.map(m => m.move.name);
    const fullMovesList = "All moves:\n"  + moves.join(', ');
    const shortMovesList = moves.slice(0, Math.min(maxMoves, moves.length)).join(', ') + (maxMoves < moves.length ? "..." : "");

    return `
        <div class="detail-content">
            <div class="close-button" onclick="closeDetail()"><span>+</span></div>
            <div class="pokemon ${pokemon.type}">
                <div class="name-image">
                    <span class="pokemon-name">${pokemon.name}</span>
                    <img class="pokemon-photo" src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                <div class="detail-info">
                    <ul>
                        <li><span class="detail-name">Forms:</span> ${detail.forms.map(f => `<span>${f.name}</span>`).join(', ')}</li>
                        <li><span class="detail-name">Species:</span> <span>${detail.species.name}</span></li>
                        <li><span class="detail-name">Abilities:</span> ${detail.abilities.map(a => `<span>${a.ability.name}</span>`).join(', ')}</li>
                        <li><span class="detail-name">Base Experience:</span> ${detail.base_experience}</li>
                        <li><span class="detail-name">Height:</span> ${detail.height}</li>
                        <li><span class="detail-name">Weight:</span> ${detail.weight}</li>
                        <li><span class="detail-name">Stats (base):</span>
                            <ul class="list-stat">
                                ${detail.stats.map(s => `<li><span class="stat-name">${s.stat.name}</span>: ${s.base_stat}</li>`).join('')}
                            </ul>
                        </li>
                        <li>
                            <div class="side-info">
                                <span class="detail-name">Types:</span>
                                <div class="detail">
                                    <div class="types">
                                        ${pokemon.types.map((type) => `<div class="type ${type}">${type}</div>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li title="${fullMovesList}"><span class="detail-name">Mmoves:</span> ${shortMovesList}</li>
                    </ul>
                </div>
            </div>
        </div>
    `
}

function closeDetail() {
    const elem = document.getElementById(modalDetailId);
    if(elem) {
        elem.remove();
    }
}

function openDetailModal(name, detail) {
    const body = document.getElementsByTagName("body");
    if(body && body[0]) {
        const modal = document.createElement('div');
        modal.id = modalDetailId;
        modal.onclick = function(evnt) { evnt.preventDefault(); };
        modal.innerHTML = buildDetailHTML(name, detail);
        body[0].appendChild(modal);
    }
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})