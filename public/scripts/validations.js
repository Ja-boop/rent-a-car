let form = document.querySelector('#form');
let clientValue = document.querySelector('#client-id');

form.addEventListener('submit', (event) => {
    let daysDistance = getDaysDistance();

    if (clientValue.checked === false) {
        alert('Debe elegir un cliente para alquilar el vehiculo');
        event.preventDefault()
    }
   
    if (daysDistance <= 0) {
        alert('La fecha de retiro es mayor a la fecha de entrega')
        takeDay.select();
        takeDay.focus();
        event.preventDefault()
    }    
});
