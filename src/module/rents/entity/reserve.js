module.exports = class Reserve {
    constructor({
        id,
        userId,
        carId,
        carImage,
        takeDay,
        returnDay,
        cost,
    }) {
        this.id = id;
        this.userId = userId;
        this.carId = carId;
        this.carImage = carImage;
        this.takeDay = takeDay;
        this.returnDay = returnDay;
        this.cost = cost;
    }
};
