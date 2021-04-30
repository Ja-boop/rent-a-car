const AbstractRentRepository = require('../sqlite/abstract/abstractRentRepository');
const { fromModelToEntity } = require('../../mapper/reserveMapper');

module.exports = class RentsRepository extends AbstractRentRepository {
    /**
     * @param {typeof import('../../model/rentModel')} rentModel
     */
    constructor(rentModel) {
        super();
        this.rentModel = rentModel;
    }

    /**
     * @param {typeof import('../../entity/rent')} rent
     * @returns {Promise<import('../../entity/rent')>}
     */
    async rentCar(reserve) {
        let rentModel;

        const buildOptions = { isNewRecord: !reserve.id };
        rentModel = this.rentModel.build(reserve, buildOptions);
        rentModel = await rentModel.save();

        return fromModelToEntity(rentModel);
    }

    /**
     * @param {typeof import('../../entity/rent')} rent
     * @returns {Boolean}
     */
    async deleteReserve(reserve) {
        if(!reserve || !reserve.id) {
            throw new Error('Id not defined')
        }
        return Boolean(await this.rentModel.destroy({ where: { id: reserve.id } }));
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getUserReserve(id) {
        const reserves = await this.rentModel.findAll({
            where: { userId: id },
        });

        if (!reserves) {
            throw new Error(`Reserve with id: ${id} was not found`)
        }

        return reserves.map(fromModelToEntity);
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getReserveById(id) {
        const rentModel = await this.rentModel.findOne({
            where: { id },
        });

        if (!rentModel) {
            throw new Error(`Reserve with id: ${id} was not found`)
        }

        return fromModelToEntity(rentModel);
    }
}
