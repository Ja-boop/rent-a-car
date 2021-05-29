const AbstractRentRepository = require('../sqlite/abstract/abstractRentRepository');
const { fromModelToEntity } = require('../../mapper/reserveMapper');
const ReserveNotFoundError = require('./error/reserveNotFoundError');
const ReserveIdNotDefinedError = require('./error/reserveIdNotDefinedError');

module.exports = class RentsRepository extends AbstractRentRepository {
    /**
     * @param {typeof import('../../model/rentModel')} rentModel
     * @param {typeof import('../../../cars/model/carModel')} carModel
     * @param {typeof import('../../../clients/model/clientModel')} clientModel
     */
    constructor(rentModel, carModel, clientModel) {
        super();
        this.rentModel = rentModel;
        this.carModel = carModel;
        this.clientModel = clientModel;
    }

    /**
     * @param {typeof import('../../entity/reserve')} reserve
     * @returns {Promise<import('../../entity/reserve')>}
     */
    async rentCar(reserve) {
        let rentModel;

        const buildOptions = { isNewRecord: !reserve.id };
        rentModel = this.rentModel.build(reserve, buildOptions);
        rentModel.setDataValue('car_id', reserve.Car.id);
        rentModel.setDataValue('client_id', reserve.Client.id);
        rentModel = await rentModel.save();

        return fromModelToEntity(rentModel);
    }

    /**
     * @param {typeof import('../../entity/rent')} rent
     * @returns {Boolean}
     */
    async deleteReserve(reserve) {
        if(!reserve || !reserve.id) {
            throw new ReserveIdNotDefinedError();
        }
        return Boolean(await this.rentModel.destroy({ where: { id: reserve.id } }));
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getUserReserve(id) {
        try {
            const reserves = await this.rentModel.findAll({
                where: { client_id: id },
                include: [this.carModel, this.clientModel],
            });

            return reserves.map(fromModelToEntity);
        } catch(e) {
            console.log(e)
            throw new ReserveNotFoundError();
        }
        
    }

    async getAllReserves() {
        const reserves = await this.rentModel.findAll({
            include: [this.carModel, this.clientModel],
        });
        return reserves.map(fromModelToEntity);
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getReserveById(id) {
        const rentModel = await this.rentModel.findOne({
            where: { id },
            include: [this.carModel, this.clientModel],
        });

        if (!rentModel) {
            throw new ReserveNotFoundError()
        }

        return fromModelToEntity(rentModel);
    }
}
