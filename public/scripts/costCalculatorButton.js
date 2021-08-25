let takeDay = document.querySelector('#take-day');
let returnDay = document.querySelector('#return-day');
let cost = document.querySelector('#car-cost');
let rentCost = document.querySelector('#rent-cost');
let integer = parseInt(cost.value, 10);

returnDay.addEventListener('blur', () => {
    let daysDistance = getDaysDistance();
   
    if (daysDistance <= 0) {
        alert('Departure day takes after the return date')
        takeDay.select();
        takeDay.focus();
    } else {
        changeCostValue(daysDistance);
    }
    
});

function changeCostValue(daysDistance) {
    let costValue = cost.value = integer * daysDistance;
    rentCost.value = costValue;
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
