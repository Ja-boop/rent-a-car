const { fromModelToEntity } = require('../../mapper/carMapper');
const AbstractCarsRepository = require('./abstract/abstractCarsRepository');
const CarNotFoundError = require('./error/carNotFoundError');
const CarIdNotDefinedError = require('./error/carIdNotDefinedError');

module.exports = class CarsRepository extends AbstractCarsRepository {
    /**
     * @param {typeof import('../../model/carModel')} carModel
     */
    constructor(carModel) {
        super();
        this.carModel = carModel;
    }

    /**
     * @param {typeof import('../../entity/car')} car
     * @returns {Promise<import('../../entity/car')>}
     */
    async saveCar(car) {
        let carModel;

        const buildOptions = { isNewRecord: !car.id };
        carModel = this.carModel.build(car, buildOptions);
        carModel = await carModel.save();

        return fromModelToEntity(carModel);
    }

    /**
     * @param {typeof import('../../entity/car')} car
     * @returns {Boolean}
     */
    async deleteCar(car) {
        if(!car || !car.id) {
            throw new CarIdNotDefinedError();
        }
        return Boolean(await this.carModel.destroy({ where: { id: car.id } }));
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/car')>}
     */
    async getCarById(id) {
        const carModel = await this.carModel.findOne({
            where: { id },
        });

        if (!carModel) {
            throw new CarNotFoundError();
        }

        return fromModelToEntity(carModel);
    }

    /**
     * @return {Promise<Array<import('../../entity/car')>>}
     */
    async getAllCars() {
        const cars = await this.carModel.findAll();
        return cars.map(fromModelToEntity);
    }
}; 
