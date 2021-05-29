/// <reference types="Jest" />

const CarEntity = require('../../entity/car');
const { fromDataToEntity, fromModelToEntity } = require('../carMapper');

/**
 * @type CarEntity
 */
const sampleCar = {
    brand: 'BMW',
    model: 'M3 GTR',
    'image-url': '123',
    'year-manufactured': 2000,
    kms: 150000,
    color: 'Red',
    'air-conditioner': 'No',
    passengers: 2,
    transmission: 'Manual',
    cost: 60000,
};

test('Modifica los datos para que sea compatible con la entidad', () => {
    const carEntity = fromDataToEntity(sampleCar);
    expect(carEntity).toHaveProperty('airConditioner');
}); 

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
           toJSON() {
               return {}
           }, 
        })
    ).toBeInstanceOf(CarEntity);
});
