module.exports = class Reserve {
    constructor({
        id,
        userEmail,
        carId,
        takeDay,
        returnDay,
        cost,
    }) {
        this.id = id;
        this.userEmail = userEmail;
        this.carId = carId;
        this.takeDay = takeDay;
        this.returnDay = returnDay;
        this.cost = cost;
    }
};
