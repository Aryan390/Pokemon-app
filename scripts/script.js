// DOM elements
const img = document.getElementById('img')
const pokemonHolder = document.getElementById('pokemon')
const btn = document.getElementById('btn')
const searchBtn = document.getElementById('search-btn')
const search = document.getElementById('pokemon-input')
const form = document.getElementById('search-form')


// global variable for pokemon holdings
const pokeArr = []

// global pokemon html for cards
const pokeStr = []

// variable to track count
let count = 0;


// function for getting pokemon data
function fetchPokemon(){
  // this is a promise array holding json data for all the pokemon
  const promise = []
  // 898 is the number of total pokemon in the database of the api
  let pokemonNumber = 30
  for(let i = 1; i <= pokemonNumber ; i++){
    promise.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)
        .then(result => result.json())
        .catch(err => console.log(err))
    )
  }
  // passes the result for all pokemon and runs the promise parallel to one another instead of sequential manner like in a for loop
  Promise.all(promise).then(result => {
    result.forEach(data => {
      // console.log(data);
      const pokemon = {
        name :  data.name,
        id : data.id,
        types : data.types.map(curr => curr.type.name),
        img : data.sprites['front_default'],
        stats : data.stats.map(curr =>{
          return {
            name: curr.stat.name,
            value : curr['base_stat']
          }
        })
      }
      pokeArr.push(pokemon)
      displayPokemon(pokemon, result.length)
    })
  })
}

// function for attacking the pokemon data to the DOM
function displayPokemon(pokemon, allPokemon){
  // console.log(pokemon);
  let pokeString = `
    <div class="pokemon-container">
      <div class="poke-card">
        <div class="front-content">
          <div class="image-section">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="${pokemon.name}"
            <p>#${pokemon.id}</p>
            <h1>${pokemon.name}</h1>
          </div>
          <div class="types-section" id="types-section" data-types="${pokemon.types}"></div>
        </div>
        <div class="back-content">
          <div class="stats-list">
            <div class="stat-value">
              <span>${pokemon.stats[0].name}</span>
              <span>${pokemon.stats[0].value}</span>
            </div>
            <div class="stat-value">
              <span>${pokemon.stats[1].name}</span>
              <span>${pokemon.stats[1].value}</span>
            </div>
            <div class="stat-value">
              <span>${pokemon.stats[2].name}</span>
              <span>${pokemon.stats[2].value}</span>
            </div>
            <div class="stat-value">
              <span>${pokemon.stats[3].name}</span>
              <span>${pokemon.stats[3].value}</span>
            </div>
            <div class="stat-value">
              <span>${pokemon.stats[4].name}</span>
              <span>${pokemon.stats[4].value}</span>
            </div>
            <div class="stat-value">
              <span>${pokemon.stats[5].name}</span>
              <span>${pokemon.stats[5].value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  pokeStr.push({
    html: pokeString,
    pokeName: pokemon.name
  })

  pokemonHolder.innerHTML += pokeString
  // count keeps track of the displayPokemon() method call
  count++

  if(count === allPokemon){
    // code to get type buttons in the UI 
    const typeSection  = document.querySelectorAll('#types-section')
    // console.log(typeSection);

    typeSection.forEach(card => {
      let types = card.getAttribute('data-types').split(',')
      // console.log(types);
      types.forEach(type => {
        card.innerHTML += `
          <button class="type ${type}">${type}</button>
        `
      })
    })
  }
}

fetchPokemon()
autoComplete()


// event listeners for all the buttons and select options
btn.addEventListener('click',()=>{
  const newArr = [...pokeStr]
    .map(a => ({value: a, sort: Math.random()}))
    .sort((a,b) => a.sort - b.sort)
    .map(a => a.value)
    .map(a => a.html)

  pokemonHolder.innerHTML = newArr.join('')
})


// event listener for input autocomplete
function autoComplete(){
  let currentFocus;

  search.addEventListener('input',function(e){
    let a, b;
    let val = this.value;
    
    closeAllLists()

    if(!val) {return false}
    currentFocus = -1;

    // create a div element that will have all the div values
    a = document.createElement('div')
    a.className = 'autocomplete-items'
    // append the above div as a child of the autocomplete div
    this.parentNode.appendChild(a)
    // for each item in the array
    pokeArr.forEach(pokemon => {
      if(pokemon.name.substr(0, val.length).toUpperCase() === val.toUpperCase()){
        // create a div element for each matching element
        b = document.createElement('div')
        // make the matching letters bold of the first letter of the word
        b.innerHTML += `<strong>${pokemon.name.substr(0, val.length)}</strong>`
        // the rest of the word excluding the first letter
        b.innerHTML += pokemon.name.substr(val.length);

        b.innerHTML += `<input type="hidden" value="${pokemon.name}">`

        // event listener for when someone click on the autocompleted div
        b.addEventListener('click', function(e){
          search.value = this.getElementsByTagName('input')[0].value
          closeAllLists();
        })
        a.appendChild(b);
        // console.log(a,b);
      }
    })
  })
}

function closeAllLists(elmnt) {
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  let x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != search) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
  closeAllLists(e.target);
});

// event listener for search of pokemon
searchBtn.addEventListener('click',function(e){
  if(!search.value) return;

  pokeStr.forEach(pokemon => {
    if(pokemon.pokeName.toUpperCase() === search.value.toUpperCase()){
      pokemonHolder.innerHTML = pokemon.html
      console.log(pokemon);
    }
  })
  
})

// event listener for preventing form default behaviour
form.addEventListener('submit', function(e){
  e.preventDefault()
})