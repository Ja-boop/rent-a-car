/**
 * @typedef {import('../repository/sqlite/carsRepositoryAbstract')} AbstractCarsRepository
*/

const Car = require('../entity/car');

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
            throw new console.error('Car is not defined');
        }
        return this.carsRepository.saveCar(car)
    }

    /**
     * @param {Car} car
     */
    async deleteCar(car) {
        if(!(car instanceof Car)) {
            throw new console.error();
        }

        return this.carsRepository.deleteCar(car);
    }


    async getCarById(id) {
        if(id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.carsRepository.getCarById(id);
    }

    /**
     * @param {Car} car
     */
    async getAllCars() {
        return this.carsRepository.getAllCars();
    }

    async getUserCars(id) {
        if(id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.carsRepository.getUserCars(id);
    }

    
};
