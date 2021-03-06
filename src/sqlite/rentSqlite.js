const Sqlite3Database = require('better-sqlite3');
const db = new Sqlite3Database(process.env.RESERVE_DB_PATH, { verbose: console.log });
const { getCarById } = require('../sqlite/crudCarSqlite');
const { getUserByEmail } = require('../sqlite/userSqlite');
const { fromDataToEntityReserve } = require('../mapper/reserveMapper');

async function rentCar (userId, carId, reserve) {
    const stmt = db.prepare(`
    
    `)
};

async function getUserReserve (email) {
    const reserve = db.prepare(`
        SELECT
            id,
            user_email,
            car_id,
            take_day,
            return_day,
            cost
        FROM reserve_cars WHERE user_email = ?
    `)
    .get(email);

    return fromDataToEntityReserve(reserve);
}

module.exports = { getUserReserve };
