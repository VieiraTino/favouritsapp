document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('loginForm')
        .addEventListener('submit', login);
})


function login(event) {
    event.preventDefault();
    let formData = new FormData(event.target)

    const body = {}
    for (let key of formData.keys()) {
        body[key] = formData.get(key)
    }

    const url = 'https://my-movie-favourites.herokuapp.com/api/login'


    let data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }

    fetch(url, data)
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                window.location = 'https://my-movie-favourites.herokuapp.com/tmdb';
            } else {
                alert('Username ou password incorreta');
            }
        })
}