const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'http://us-central1-escuelajs-api.cloudfunctions.net/characters';

const getData = api => {
  return fetch(api)
    .then(response => response.json())
    .catch(error => console.log(error));
}

const loadData = async () => {
  const apiUrl = localStorage.getItem('next_fetch') ? localStorage.getItem('next_fetch') : API;
  const response = await getData(apiUrl);

  localStorage.setItem('next_fetch', response.info.next);
  console.log(`next_fetch ${localStorage.getItem('next_fetch')}`);
  const characters = response.results;
  let output = characters.map(character => {
    return `
  <article class="Card">
    <img src="${character.image}" />
    <h2>${character.name}<span>${character.species}</span></h2>
  </article>
`
  }).join('');
  let newItem = document.createElement('section');
  newItem.classList.add('Items');
  newItem.innerHTML = output;
  $app.appendChild(newItem);
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

if (performance.navigation.type == 1) {
  localStorage.removeItem('next_fetch');
} 
window.addEventListener("beforeunload", function (event) {
  localStorage.removeItem('next_fetch');
});
