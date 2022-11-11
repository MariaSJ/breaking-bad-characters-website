'use strict';

//------------ VARIABLES -----------//

const ulCharacters = document.querySelector('.js-list-characters');
let listCharacters = []; // variable vacía para guardar los personajes que me devuelve el servidor


//------------- FUNCTIONS ----------//

// function listener (para poder escuchar cada una de las tarjetas de los personajes)

function listenerEachCard() {
    const listCard = document.querySelectorAll('.js-card-character');
    for (const card of listCard) {
        card.addEventListener('click', () => console.log('escuchada'));
    }
}

// function render (para pintar cada personaje)

function renderCharacters() {
    let liHtml = "";
    // recorro el array para extraer los datos y meterlos en html 
    for (const character of listCharacters) {
        liHtml += `<li class="character js-card-character">`;
        liHtml += `<img class="character__img" src="${character.img}" alt="">`;
        liHtml += `<h4 class="character__name">${character.name}</h4>`;
        liHtml += `<p class="character__status">${character.status}</p>`;
        liHtml += `</li>`;
    }
    // pintamos los personaje y ESCUCHAMOS cuando clicamos en cada una (1º lo pinto para que exista y luego lo escucho)
    ulCharacters.innerHTML = liHtml;
    listenerEachCard();
};

// Fetch (lo metemos en una función)

function getData () {
    fetch("https://breakingbadapi.com/api/characters")
        .then((response) => response.json())
        .then((data) => {
            listCharacters = data;
            console.log(listCharacters);
            renderCharacters();
    });
}

getData();



// Función para guaradar en el local.storage


//---------------- EVENTS ------------------//

/* Eventos en cada personaje para: 
    1. guardarlos en en array nuevo de favoritos 
    2. para quitar / dar clases css (cuando queda seleccionada como favorita, etc)
*/