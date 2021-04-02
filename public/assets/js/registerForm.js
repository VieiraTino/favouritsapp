document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('registerForm')
        .addEventListener('submit', register);
})

function register(event) {
    event.preventDefault();
    let formData = new FormData(event.target)

    const body = {}
    for(let key of formData.keys()){ 
        body[key] = formData.get(key)
    }

    const url = 'http://localhost:3000/api/user'
    

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
            if(data.errors){
                alert(data.message);
            } else {
                window.location = 'http://localhost:3000/';
                alert('Registo efetuado com sucesso, por favor faça login');
            }
        })
}