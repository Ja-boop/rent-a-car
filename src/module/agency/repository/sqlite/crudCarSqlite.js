const { fromDataToEntity } = require('../../mapper/carMapper');
const AbstractCarsRepository = require('./abstract/abstractCarsRepository');

module.exports = class CarsRepository extends AbstractCarsRepository {
    /**
     * @param {import('better-sqlite3').Database} databaseAdapter 
     */
    constructor(databaseAdapter) {
        super();
        this.databaseAdapter = databaseAdapter; 
    }

    /**
     * @param {import('../../entity/car')} car
     * @returns {import('../../entity/car')}
     */
    saveCar(car) {
        let id;
        if (car.id) {
            id = car.id;
            const stmt = this.databaseAdapter.prepare(
                `UPDATE lista_vehiculos SET 
                ${car.imageUrl ? `image_url = ?,` : ''}
                brand = ?,
                model = ?,
                year_manufactured = ?,
                kms = ?,
                color = ?,
                air_conditioner = ?,
                passengers = ?,
                transmission = ?,
                cost = ?
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
                car.cost,
                car.id,
            ];

            if (car.imageUrl) {
                params.unshift(car.imageUrl);
            }

            stmt.run(params);
        } else {
            const stmt = this.databaseAdapter.prepare(`
            INSERT INTO lista_vehiculos(
                brand,
                model,
                image_url,
                year_manufactured,
                kms,
                color,
                air_conditioner,
                passengers,
                transmission,
                cost
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                car.transmission,
                car.cost
            );

            id = result.lastInsertRowid;
        }

        return this.getCarById(id);
    };

    deleteCar(car) {
        if (!car || !car.id) {
            throw new Error('El ID del auto no esta definido');
        };

        this.databaseAdapter.prepare('DELETE FROM lista_vehiculos WHERE id = ?').run(car.id);

        return true;
    };

    getCarById(id) {
        const car = this.databaseAdapter.prepare(`
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
            transmission,
            cost
        FROM lista_vehiculos WHERE id = ?
    `)
            .get(id);

        if (car === undefined) {
            throw new Error(`No se encontro el vehículo con el ID: ${id}`);
        };

        return fromDataToEntity(car);
    };

    getAllCars() {
        const cars = this.databaseAdapter.prepare(
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
            transmission,
            cost
        FROM lista_vehiculos`
        )
        .all();
        return cars.map((carData) => fromDataToEntity(carData));
    };

    getUserCars(id) {
        const stmt = this.databaseAdapter.prepare(`SELECT * FROM lista_vehiculos WHERE id = ?`);
        const cars = stmt.all(id);
        return cars.map((carData) => fromDataToEntity(carData));
    }

}
