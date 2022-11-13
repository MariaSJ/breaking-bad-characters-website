'use strict';

//-------------------------------- VARIABLES -------------------------------------------//

const ulCharacters = document.querySelector('.js-list-characters');
const ulfavourites = document.querySelector('.js-favourites-list');

let listCharacters = []; // variable vacía para guardar los personajes que me devuelve el servidor
let favCharacters = []; // variable para guardar los personajes favoritos


//--------------------------------- FUNCTIONS -------------------------------------------//

// Fetch (lo metemos en una función)

function getData () {
    fetch("https://breakingbadapi.com/api/characters")
        .then((response) => response.json())
        .then((data) => {
            listCharacters = data;
            renderAllCharacters();
    });
}

getData();


// function render (para pintar cada personaje)

// TODOS LOS PERSONAJES

function renderAllCharacters() {
    let liHtml = "";
    // recorremos el array para extraer los datos y meterlos en el html 
    for (const character of listCharacters) {
        liHtml += `<li class="character js-card-character" id="${character.char_id}">`;
        liHtml += `<img class="character__img" src="${character.img}" alt="">`;
        liHtml += `<h4 class="character__name">${character.name}</h4>`;
        liHtml += `<p class="character__status">${character.status}</p>`;
        liHtml += `</li>`;
    }
    // pintamos los personaje y ESCUCHAMOS cuando clicamos en cada una (1º lo pinto para que exista y luego lo escucho)
    ulCharacters.innerHTML = liHtml;
    listenerEachChar();
}

// SOLO FAVORITOS

function renderFavCharacters() {
    let liHtml = "";
    for (const favChar of favCharacters){
        liHtml += `<li class="character js-card-character" id="${favChar.char_id}">`;
        liHtml += `<img class="character__img" src="${favChar.img}" alt="">`;
        liHtml += `<h4 class="character__name">${favChar.name}</h4>`;
        liHtml += `<p class="character__status">${favChar.status}</p>`;
        liHtml += `</li>`;
    }
    ulfavourites.innerHTML = liHtml;
}



// FUNCIÓN MANEJADORA (para meter los personajes favoritos en el array fav. Llamamos a esta función en el evento listenerEachCard).

function handleClick(event) {

    event.currentTarget.classList.toggle('selected');
    // 1. rescatamos la carta seleccionada mediante su id
    const charSelected = event.currentTarget.id; //constante donde guardar la card seleccionada
    const charFound = listCharacters.find((pCharObj) => pCharObj.char_id === parseInt(charSelected)); // constante que me devuelve el personaje clicado. ParseInt para pasar el string que devuelve currentTarget a nº
    
    // 2. la metemos en favoritos. 1º evitamos que se dupliquen verificando si ya está en fav, buscamos con findIndex
    const charFavFound = favCharacters.findIndex((favCharObj) => favCharObj.char_id === parseInt(charSelected)); // const si está o no, si es -1 no está y lo añade. Si ya está, no hace nada. 
    if (charFavFound === -1) {
        favCharacters.push(charFound);
     } else {
        favCharacters.splice(charFavFound, 1);
    } //ESTO PUEDE ELIMINAR EL PERSONAJE
    
    renderFavCharacters();
}

console.log(ulfavourites);










// Función para guaradar en el local.storage


//---------------------------------------- EVENTS ---------------------------------//


// function listener (para poder escuchar cada una de las tarjetas de los personajes)

function listenerEachChar() {
    // seleccionamos TODAS las cartas y como es un array declaramos el evento mediante un for
    const listChar = document.querySelectorAll('.js-card-character');
    for (const char of listChar) {
        char.addEventListener('click', handleClick);
    }
}