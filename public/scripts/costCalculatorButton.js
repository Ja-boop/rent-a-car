const button = document.querySelector('#cost-calculator');
let cost = document.querySelector('#rent-cost');
let integer = parseInt(cost.innerText, 10);

button.addEventListener('click', () => {
    const takeDay = document.querySelector('#take-date').value;
    const returnDay = document.querySelector('#return-date').value;

    const newTekeDate = new Date(takeDay)
    const newReturnDate = new Date(returnDay)

    let diff = newReturnDate.getTime() - newTekeDate.getTime();
    let msInDays = 1000 * 3600 * 24;
    
    const daysDistance = diff/msInDays + 1;
   
    if (daysDistance <= 0) {
        alert('La fecha de retiro es mayor a la fecha de entrega')
    } else {
        cost.innerText = integer * daysDistance;
    }
    
});
