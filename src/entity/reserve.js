module.exports = class Reserve {
    constructor({
        id,
        userEmail,
        carId,
        carImage,
        takeDay,
        returnDay,
        cost,
    }) {
        this.id = id;
        this.userEmail = userEmail;
        this.carId = carId;
        this.carImage = carImage;
        this.takeDay = takeDay;
        this.returnDay = returnDay;
        this.cost = cost;
    }
};
