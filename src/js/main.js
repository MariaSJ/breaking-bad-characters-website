'use strict';

//-------------------------------- VARIABLES -------------------------------------------//

const ulCharacters = document.querySelector('.js-list-characters');
const ulfavourites = document.querySelector('.js-favourites-list');
const btnSearch = document.querySelector('.js-btn-search');
const inputTextSearch = document.querySelector('.js-input-search');
const btnResetFav = document.querySelector('.js-favs-reset');
const titleSectionFav = document.querySelector('.js-fav-title');


let listCharacters = []; // variable vacía para guardar los personajes que me devuelve el servidor
let favCharacters = []; // variable para guardar los personajes favoritos


//--------------------------------- FUNCTIONS -------------------------------------------//

// Fetch 

function getData () {
    fetch("https://breakingbadapi.com/api/characters")
        .then((response) => response.json())
        .then((data) => {
            listCharacters = data;
            renderAllCharacters(listCharacters);
    });
};

getData();

// Función para guardar en el local.storage

const saveFavouritesChar = JSON.parse(localStorage.getItem('favChar'));
if (saveFavouritesChar !== null){ 
    favCharacters = saveFavouritesChar;
    showMesageAndBtnFavs();
    renderFavCharacters();
};


//--------------------------- FUNCIONES RENDER (para pintar cada personaje) 

// TODOS LOS PERSONAJES

function renderAllCharacters(pListCharacters) {
    
    // buscamos su nuestro personaje de la lista está marcado como favorito a través del indice. Si está, le añadimos la clase selected. 
    
    let liHtml = "";
    // recorremos el array para extraer los datos y meterlos en el html 
    
    let classFav = "";
    for (const character of pListCharacters) {
        const favCharIndex = favCharacters.findIndex((pEachCharObj) => pEachCharObj.char_id === character.char_id);
        if (favCharIndex === -1) {
            classFav = "";
        } else {
            classFav = 'selected';
        } 
        liHtml += `<li class="character js-card-character ${classFav}" id="${character.char_id}">`;
        liHtml += `<img class="character__img" src="${character.img}" alt="">`;
        liHtml += `<h4 class="character__name">${character.name}</h4>`;
        liHtml += `<ul class="character__ocupation">`
        const listOcupation = character.occupation;
        for (const liItem of listOcupation) {
            liHtml +=`<li>${liItem}</li>`
        }
        liHtml +=`</ul>`;
        liHtml += `<p class="character__status">${character.status}</p>`;
        liHtml += `</li>`;
    }
    // pintamos los personaje y ESCUCHAMOS cuando clicamos en cada una (1º lo pinto para que exista y luego lo escucho).
    ulCharacters.innerHTML = liHtml;
    listenerEachChar();
};



// SOLO LOS FAVORITOS

function renderFavCharacters() {
    // 1. Pinto mi lista de favoritos
    let liHtml = "";
    for (const favChar of favCharacters){
        liHtml += `<li class="character" id="${favChar.char_id}">`;
        liHtml += `<img class="character__img" src="${favChar.img}" alt="">`;
        liHtml += `<h4 class="character__name">${favChar.name}</h4>`;
        liHtml += `<p class="character__status">${favChar.status}</p>`;
        liHtml += `<button class="btn-delete js-btn-delete">X</button>`;
        liHtml += `</li>`;
    }
    ulfavourites.innerHTML = liHtml;

    // 2. Escucho cada botón del personaje favorito (cada vez que refresque la pagina)
    const btnDeleteFavList = document.querySelectorAll('.js-btn-delete');
    for (const pbtnDelete of btnDeleteFavList) {
        // evento para borrar un personaje de mi lista de favoritos y del localStorage
        pbtnDelete.addEventListener('click', (event) => {
            event.preventDefault();
            const charFavSelected = event.currentTarget.id;
            const charFavFound = favCharacters.findIndex((pFavCharObj) => pFavCharObj.char_id === parseInt(charFavSelected));
            favCharacters.splice(charFavFound, 1);
            localStorage.setItem('favChar', JSON.stringify(favCharacters));
            renderFavCharacters(favCharacters);
            renderAllCharacters(listCharacters);
            showMesageAndBtnFavs();
        }); 
    } 
};

// función para mostrar mensaje en favoritos y el botón de reset.

function showMesageAndBtnFavs() {
    if (favCharacters.length === 0) {
        titleSectionFav.classList.remove('hidden');
        btnResetFav.classList.add('hidden');
    } else {
        titleSectionFav.classList.add('hidden');
        btnResetFav.classList.remove('hidden');
    }
};


// ------- FUNCIÓN MANEJADORA (Llamamos a esta función en el evento listenerEachCard).

function handleClick(event) {
    // 1. rescatamos la carta seleccionada mediante su id
    const charSelected = event.currentTarget.id; //constante donde guardar la card seleccionada
    const charFound = listCharacters.find((pCharObj) => pCharObj.char_id === parseInt(charSelected)); // constante que me devuelve el personaje clicado. ParseInt para pasar a nº el string que devuelve currentTarget

    // 2. la metemos en favoritos. 1º evitamos que se dupliquen verificando si ya está en fav, buscamos con findIndex
    // const charFavFound = favCharacters.findIndex((favCharObj) => favCharObj.char_id === parseInt(charSelected)); // const si está o no, si es -1 no está y lo añade. Si ya está, no hace nada. 
    // if (charFavFound === -1) {
    //     event.currentTarget.classList.add('selected');
    //     favCharacters.push(charFound);
    //     localStorage.setItem('favChar', JSON.stringify(favCharacters));
    //     titleSectionFav.classList.add('hidden');
    //     btnResetFav.classList.remove('hidden');
    // } else {
    //     event.currentTarget.classList.remove('selected');
    //     favCharacters.splice(charFavFound, 1);
    //     localStorage.setItem('favChar', JSON.stringify(favCharacters));
    //    //ESTO ELIMINA EL PERSONAJE
    // }
    
    console.log(charFound.name);
    renderFavCharacters();
};


    
//---------------------------------------- EVENTS ---------------------------------//

// función/evento listener (para poder escuchar cada uno de los personajes)

function listenerEachChar() {
    // seleccionamos TODAS las cartas y como es un array declaramos el evento mediante un for
    const listChar = document.querySelectorAll('.js-card-character');
    for (const char of listChar) {
        char.addEventListener('click', handleClick);
    }
};

// evento para filtrar al clicar en el botón de buscar

btnSearch.addEventListener('click', (event) => {
    event.preventDefault();
    const userSearch = inputTextSearch.value.toLowerCase();
    const searchChar = listCharacters.filter((eachCaracter) => eachCaracter.name.toLowerCase().includes(userSearch));
    renderAllCharacters(searchChar);
});

// evento para pintar otra vez la lista completa de personajes al borrar en el input text de úsqueda

inputTextSearch.addEventListener('input', () => {
    renderAllCharacters(listCharacters);
});

// evento para quitar TODOS los personajes de la lista de favoritos

btnResetFav.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('favChar');
    favCharacters.length = 0;
    renderFavCharacters(favCharacters);
    renderAllCharacters(listCharacters);
    titleSectionFav.classList.remove('hidden');
    btnResetFav.classList.add('hidden');
});
