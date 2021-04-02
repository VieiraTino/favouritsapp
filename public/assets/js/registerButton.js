document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.querySelector('.register');

    registerButton
        .addEventListener('click', sendToRegisterPage);
})

sendToRegisterPage = () => {
    window.location = 'http://localhost:3000/register';
}