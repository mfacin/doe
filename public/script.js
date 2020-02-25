const button = document.querySelector('header button')
const form = document.querySelector('.form')

button.addEventListener('click', () => {
    form.classList.toggle('hide')
})