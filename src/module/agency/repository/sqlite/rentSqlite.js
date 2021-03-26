const AbstractRentRepository = require('../sqlite/abstract/abstractRentRepository');
const { fromDataToEntityReserve } = require('../../mapper/reserveMapper');

module.exports = class RentRepository extends AbstractRentRepository {
    /**
     * @param {import('better-sqlite3').Database} databaseAdapter 
     */
    constructor(databaseAdapter) {
        super();
        this.databaseAdapter = databaseAdapter;
    }

    /**
     * @param {import('../../entity/reserve')} reserve
     * @returns {import('../../entity/reserve')}
     */
    rentCar(reserve) {
        let id;
        if (reserve.id) {
            id = reserve.id;
            const stmt = this.databaseAdapter.prepare(
                `UPDATE reserve_cars SET
                user_id = ?,
                car_id = ?,
                car_image = ?,
                take_day = ?,
                return_day = ?,
                cost = ?
            WHERE id = ?`
            );

            const params = [
                reserve.userId,
                reserve.carId,
                reserve.carImage,
                reserve.takeDay,
                reserve.returnDay,
                reserve.cost,
                reserve.id,
            ];

            stmt.run(params);
        } else {
            const stmt = this.databaseAdapter.prepare(
                `INSERT INTO reserve_cars(
                user_id,
                car_id,
                car_image,
                take_day,
                return_day,
                cost
            ) VALUES(?, ?, ?, ?, ?, ?)`
            );

            const result = stmt.run(
                reserve.userId,
                reserve.carId,
                reserve.carImage,
                reserve.takeDay,
                reserve.returnDay,
                reserve.cost,
            );

            id = result.lastInsertRowid;
        };

        return this.getUserReserve(id);

    };

    getUserReserve(id) {
        const stmt = this.databaseAdapter.prepare(`SELECT * FROM reserve_cars WHERE user_id = ?`)
        const reserve = stmt.all(id);
        return reserve.map((reserveData) => fromDataToEntityReserve(reserveData));
    };

    getReserveById(id) {
        const stmt = this.databaseAdapter.prepare(`SELECT * FROM reserve_cars WHERE id = ?`)
        const reserve = stmt.get(id);
        return fromDataToEntityReserve(reserve);
    };

    deleteReserve(reserve) {
        if (!reserve || !reserve.id) {
            throw new Error('Reserve ID not defined');
        };

        this.databaseAdapter.prepare('DELETE FROM reserve_cars WHERE id = ?').run(reserve.id);

        return true;
    };
}
