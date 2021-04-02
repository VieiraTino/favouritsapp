document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.querySelector('.register');

    registerButton
        .addEventListener('click', sendToRegisterPage);
})

sendToRegisterPage = () => {
    window.location = 'https://my-movie-favourites.herokuapp.com/register';
}