const Sqlite3Database = require('better-sqlite3');
const db = new Sqlite3Database(process.env.CAR_DB_PATH, { verbose: console.log });
const { fromDataToEntity } = require('../mapper/carMapper');

/**
 * @param {import('../entity/car')} car
 * @returns {import('../entity/car')}
 */
async function saveCar(car) {
    let id;
    if (car.id) {
        id = car.id;
        const stmt = db.prepare(
            `UPDATE lista_vehiculos SET 
                ${car.imageUrl ? `image_url = ?,` : ''}
                brand = ?,
                model = ?,
                year_manufactured = ?,
                kms = ?,
                color = ?,
                air_conditioner = ?,
                passengers = ?,
                transmission = ?
            WHERE id = ?`
        );

        const params = [
            car.brand,
            car.model,
            car.yearManufactured,
            car.kms,
            car.color,
            car.airConditioner,
            car.passengers,
            car.transmission,
            car.id,
        ];

        if (car.imageUrl) {
            params.unshift(car.imageUrl);
        }

        stmt.run(params);
    } else {
        const stmt = db.prepare(`
            INSERT INTO lista_vehiculos(
                brand,
                model,
                image_url,
                year_manufactured,
                kms,
                color,
                air_conditioner,
                passengers,
                transmission
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            car.brand,
            car.model,
            car.imageUrl,
            car.yearManufactured,
            car.kms,
            car.color,
            car.airConditioner,
            car.passengers,
            car.transmission
        );

        id = result.lastInsertRowid;
    }

    return getCarById(id);
};

async function deleteCar(car) {
    if(!car || !car.id) {
        throw new Error('El ID del auto no esta definido');
    };

    db.prepare('DELETE FROM lista_vehiculos WHERE id = ?').run(car.id);

    return true;
};

async function getCarById(id) {
    const car = db.prepare(`
        SELECT
            id,
            brand,
            model,
            image_url,
            year_manufactured,
            kms,
            color,
            air_conditioner,
            passengers,
            transmission
        FROM lista_vehiculos WHERE id = ?
    `)
    .get(id);

    if (car===undefined) {
        throw new Error(`No se encontro el vehículo con el ID: ${id}`);
    };

    return fromDataToEntity(car);
};

async function getAllCars() {
    const cars = db.prepare(
        `SELECT
            id,
            brand,
            model,
            image_url,
            year_manufactured,
            kms,
            color,
            air_conditioner,
            passengers,
            transmission
        FROM lista_vehiculos`
    )
    .all();
    return cars.map((carData) => fromDataToEntity(carData));
};

module.exports = { saveCar, deleteCar, getCarById, getAllCars };
