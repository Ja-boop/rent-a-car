let form = document.querySelector('#form');
let clientValue = document.querySelector('#client-id');

form.addEventListener('submit', (event) => {
    let daysDistance = getDaysDistance();

    if (clientValue.checked === false) {
        alert('You must select a client to continue');
        event.preventDefault()
    }
   
    if (daysDistance <= 0) {
        alert('Departure day takes after the return date')
        takeDay.select();
        takeDay.focus();
        event.preventDefault()
    }    
});
