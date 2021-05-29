/// <reference types="Jest" />

const ReserveEntity = require('../../entity/reserve');
const { fromDataToEntity, fromModelToEntity } = require('../reserveMapper');
const createTestReserve = require('../../controller/__tests__/reserve.fixture');

test('Modifica los datos para que sea compatible con la entidad', () => {
    const reserveWithoutId = createTestReserve();

    const reserveEntity = fromDataToEntity(reserveWithoutId);
    expect(reserveEntity).toHaveProperty('payment');
}); 

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
           toJSON() {
               return {}
           }, 
        })
    ).toBeInstanceOf(ReserveEntity);
});
