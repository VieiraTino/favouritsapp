document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('loginForm')
        .addEventListener('submit', login);
})


function login(event) {
    event.preventDefault();
    let formData = new FormData(event.target)

    const body = {}
    for(let key of formData.keys()){ 
        body[key] = formData.get(key)
    }

    const url = 'http://localhost:3000/api/login'
    

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
            if(data.token){
                window.location = 'http://localhost:3000/tmdb';
            } else {
                alert('Username ou password incorreta');
            }
        })
}