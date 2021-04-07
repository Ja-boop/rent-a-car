module.exports = class Car {
    constructor({
        id,
        brand,
        model,
        imageUrl,
        yearManufactured,
        kms,
        color,
        airConditioner,
        passengers,
        transmission,
        cost,
    }) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.imageUrl = imageUrl;
        this.yearManufactured = yearManufactured;
        this.kms = kms;
        this.color = color;
        this.airConditioner = airConditioner;
        this.passengers = passengers;
        this.transmission = transmission;
        this.cost = cost;
    }
};
