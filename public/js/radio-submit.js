// enables submission of form when clicking on radio input (without submit button)
const radio = document.querySelectorAll('.btn-check')
// console.log(radio)
radio.forEach(button =>{
    button.addEventListener('change', (e) => {
        e.path[1].requestSubmit()
    })
})