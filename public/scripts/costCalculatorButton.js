let takeDay = document.querySelector('#take-day');
let returnDay = document.querySelector('#return-day');
let form = document.querySelector('#form');
let cost = document.querySelector('#rent-cost');
let integer = parseInt(cost.value, 10);

returnDay.addEventListener('blur', () => {
    let daysDistance = getDaysDistance();
   
    if (daysDistance <= 0) {
        alert('La fecha de retiro es mayor a la fecha de entrega')
        takeDay.select();
        takeDay.focus();
    } else {
        changeCostValue(daysDistance);
    }
    
});

form.addEventListener('submit', (event) => {
    let daysDistance = getDaysDistance();
   
    if (daysDistance <= 0) {
        alert('La fecha de retiro es mayor a la fecha de entrega')
        takeDay.select();
        takeDay.focus();
        event.preventDefault()
    }    
});

function changeCostValue(daysDistance) {
    cost.value = integer * daysDistance;
}

function getCurrentDate() {
    let today = new Date();

    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let date = ("0" + today.getDate()).slice(-2);

    return currentDate = `${year}-${month}-${date}`
}

function getDaysDistance() {
    const newTakeDate = new Date(takeDay.value)
    const newReturnDate = new Date(returnDay.value)

    let diff = newReturnDate.getTime() - newTakeDate.getTime();
    let msInDays = 1000 * 3600 * 24;
    
    const daysDistance = diff/msInDays + 1;

    return daysDistance;
};
