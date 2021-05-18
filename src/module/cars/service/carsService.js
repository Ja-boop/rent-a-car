/**
 * @typedef {import('../repository/sqlite/carsRepositoryAbstract')} AbstractCarsRepository
*/

const Car = require('../entity/car');
const CarNotDefinedError = require('./error/carNotDefinedError');
const CarIdNotDefinedError = require('./error/carIdNotDefinedError');


module.exports = class CarsService {
    /**
     * @param {AbstractCarsRepository} carsRepository
     */
    constructor(carsRepository) {
        this.carsRepository = carsRepository
    }

    /**
     * @param {Car} car
     */
    async saveCar(car) {
        if (car === undefined) {
            throw new CarNotDefinedError();
        }
        return this.carsRepository.saveCar(car)
    }

    /**
     * @param {Car} car
     */
    async deleteCar(car) {
        if(!(car instanceof Car)) {
            throw new CarNotDefinedError();
        }

        return this.carsRepository.deleteCar(car);
    }


    async getCarById(id) {
        if(id === undefined) {
            throw new CarIdNotDefinedError();
        }

        return this.carsRepository.getCarById(id);
    }

    /**
     * @param {Car} car
     */
    async getAllCars() {
        return this.carsRepository.getAllCars();
    }  
};
