const Sqlite3Database = require('better-sqlite3');
const db = new Sqlite3Database(process.env.RESERVE_DB_PATH, { verbose: console.log });
const { fromDataToEntityReserve } = require('../../mapper/reserveMapper');

async function rentCar (reserve) {
    let id;
    if (reserve.id) {
        id = reserve.id;
        const stmt = db.prepare(
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
        const stmt = db.prepare(
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

    return getUserReserve(id);

};

async function getUserReserve (id) {
    const stmt = db.prepare(`SELECT * FROM reserve_cars WHERE user_id = ?`)
    const reserve = stmt.all(id);
    return reserve.map((reserveData) => fromDataToEntityReserve(reserveData));
};

async function getReserveById (id) {
    const stmt = db.prepare(`SELECT * FROM reserve_cars WHERE id = ?`)
    const reserve = stmt.get(id);
    return fromDataToEntityReserve(reserve);
};

async function deleteReserve (reserve) {
    if(!reserve || !reserve.id) {
        throw new Error('Reserve ID not defined');
    };

    db.prepare('DELETE FROM reserve_cars WHERE id = ?').run(reserve.id);

    return true;
};





module.exports = { deleteReserve, rentCar, getUserReserve, getReserveById };
