const URL = 'https://japceibal.github.io/japflix_api/movies-data.json';
let peliculas = [];
async function generarPeliculas(){
    const response = await fetch(URL);
    return await response.json();
}

(async () =>{
    peliculas = await generarPeliculas();
})();

const input = document.getElementById('inputBuscar');
const listaPeliculas = document.getElementById('lista');
const button = document.getElementById('btnBuscar');

button.addEventListener('click', (e) => {
    listaPeliculas.innerHTML = "";

    if (peliculas.length === 0) {
        alert('Las películas no se han cargado aún');
        return;
    }

    let valorInput = input.value.trim().toLowerCase();
    if (!valorInput) {
        alert('Por favor ingresa un título para buscar');
        return;
    }

    const encontradas = peliculas.filter(p => p.title.toLowerCase().includes(valorInput) ||
    p.genres.map(g => g.name).join(', ').toLowerCase().includes(valorInput) || p.tagline.toLowerCase().includes(valorInput) || 
    p.overview.toLowerCase().includes(valorInput));
    

    if (encontradas.length > 0) {
        encontradas.forEach(pelicula => {
        let estrellas = '';
        const puntaje = pelicula.vote_average / 2;
        for (let i=1 ; i<= 5; i++){
            if(puntaje >= i){
                estrellas += '<span class="fa fa-star checked"></span>';
            } else if(puntaje >= i - 0.5){
                estrellas += '<span class="fa fa-star-half-o checked"></span>';
            }else{
                estrellas += '<span class="fa fa-star"></span>';
            }
        }
            const li = document.createElement('li');
            li.className = "list-group-item"; 
            li.innerHTML = `<b>${pelicula.title}</b> <br> ${pelicula.tagline} ${estrellas}`;
            li.addEventListener('click', () => {
            document.getElementById('modalPeliculaLabel').textContent = pelicula.title;
            document.getElementById('modalPeliculaBody').innerHTML = `
                <p><b>Tagline:</b> ${pelicula.tagline}</p>
                <p><b>Géneros:</b> ${pelicula.genres.map(g => g.name).join(', ')}</p>
                <p><b>Descripción:</b> ${pelicula.overview}</p>
                <p><b>Puntuación:</b>${estrellas}</p>
            `;
            const dropdown = document.querySelector('.dropdown-menu');
            dropdown.innerHTML = "";
            const li_button = document.createElement('li');
            li_button.innerHTML = `<p class="dropdown-item"><b>Year: </b>${pelicula.release_date.split('-')[0]}</p>
                <p class="dropdown-item"><b>Runtime: </b>${pelicula.runtime} mins</p>
                <p class="dropdown-item"><b>Budget: </b>$${pelicula.budget}</p>
                <p class="dropdown-item"><b>Revenue: </b>$${pelicula.revenue}</p>`
            dropdown.appendChild(li_button)
            const modal = new bootstrap.Modal(document.getElementById('modalPelicula'));
            modal.show();
        });
            listaPeliculas.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.className = "list-group-item text-danger";
        li.textContent = "No se encontró ninguna película";
        listaPeliculas.appendChild(li);
    }

});
