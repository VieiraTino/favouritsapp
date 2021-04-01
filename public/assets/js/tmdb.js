document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('searchForm')
        .addEventListener('submit', searchOnTMDB);
})


function searchOnTMDB(event) {
    event.preventDefault();
    let formData = new FormData(event.target)
    const tmdbResult = document.querySelector('.tmdb_result');

    const body = {}
    for (let key of formData.keys()) {
        body[key] = formData.get(key)
    }

    const url = 'http://localhost:3000/api/movies?search=' + body.search;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error)
            } else {
                tmdbResult.innerHTML = '';

                data.forEach(element => {
                    const test = `
                        <div class="movie_card">
                            <img src="${element.poster.includes("null") ? 'http://www.chesapeakevamartialarts.com/blog/wp-content/uploads/2015/10/no_logo.gif' : element.poster}" class="movie_logo"/>
                            <div class="movie_info">
                                <p class="movie_name">Titulo: ${element.movie}</p>
                                <p class="movie_id">ID: ${element.idOnTMDB}</p>
                                <a href="http://localhost:3000/tmdb/${element.idOnTMDB}">Ver informações do filme</a>
                            </div>

                        </div>
                        `
                    tmdbResult.insertAdjacentHTML('beforeend', test);
                });
            }
        })
}