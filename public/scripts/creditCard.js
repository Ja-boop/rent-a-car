const cuotas = document.querySelector('#cuotas');
const boton = document.querySelector('#boton-cuotas');
const carCost = document.querySelector('#car-cost');
let creditOption = document.querySelector('#credit-option')
let paymentOptions = document.querySelector('#payment-options')
let cuotasDiv = document.querySelector('#cuotas-div')
let status = document.querySelector('#status');

for (let i = 1; i <= 12; i++) {
    let precioCuota = carCost.value / i;
    let options = document.createElement('option');
    options.text = `${i}x $${precioCuota.toFixed(2)}`
    cuotas.appendChild(options)
}

paymentOptions.addEventListener('change', () => {
    cuotasDiv.style.display = paymentOptions.value == "Credit Card" ? 'block' : 'none';
    if(cuotasDiv.style.display === 'block') {
        status.value = 'Yes'
    } else {
        status.value = 'No'
    }
});

