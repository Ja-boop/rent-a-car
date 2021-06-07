module.exports = class Reserve {
    constructor({
        id,
        takeDay,
        returnDay,
        payment,
        status,
        finalCost,
        Car,
        Client,
    }) {
        this.id = id;
        this.takeDay = takeDay;
        this.returnDay = returnDay;
        this.payment = payment;
        this.status = status;
        this.finalCost = finalCost;
        /**
         * @type {import('../../cars/entity/car')} this.Car
         */
        this.Car = Car;
        /**
         * @type {import('../../clients/entity/client')} this.Client
         */
        this.Client = Client;
    }
};
