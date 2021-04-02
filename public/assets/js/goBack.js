document.addEventListener('DOMContentLoaded', () => {
    const goBackButton = document.querySelector('.goBack');
    document
        .addEventListener('click', goBack);
})

goBack = () => {
    window.history.back()
};