'use strict';

//------------ VARIABLES -----------//

const ulCharacters = document.querySelector('.js-list-characters');

let listCharacters = []; // variable vacía para guardar los personajes que me devuelve el servidor
let favCharacters = [];


//------------- FUNCTIONS ----------//

// función manejadora para meter los personajes favoritos en el array fav. Llamamos a esta función en el evento listenerEachCard

function handleClick(event) {
    // 1. rescatamos la carta seleccionada mediante su id
    const charSelected = event.currentTarget.id; //constante donde guardar la card seleccionada
    console.log(charSelected);
    const charFound = listCharacters.find((pCharObj) => pCharObj.id === charSelected); // constante que me devuelve la clicada 
    
    console.log(charFound);
}



// function listener (para poder escuchar cada una de las tarjetas de los personajes)

function listenerEachChar() {
    // seleccionamos TODAS las cartas y como es un array declaramos el evento mediante un for
    const listChar = document.querySelectorAll('.js-card-character');
    for (const char of listChar) {
        char.addEventListener('click', handleClick); //handleclick
    }
}

// function render (para pintar cada personaje)

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

// Fetch (lo metemos en una función)

function getData () {
    fetch("https://breakingbadapi.com/api/characters")
        .then((response) => response.json())
        .then((data) => {
            listCharacters = data;
            console.log(listCharacters);
            renderAllCharacters();
    });
}

getData();



// Función para guaradar en el local.storage


//---------------- EVENTS ------------------//

/* Eventos en cada personaje para: 
    1. guardarlos en en array nuevo de favoritos 
    2. para quitar / dar clases css (cuando queda seleccionada como favorita, etc)
*/