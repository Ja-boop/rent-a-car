/// <reference types="Jest" />

const ClientEntity = require('../../entity/client');
const { fromDataToEntity, fromModelToEntity } = require('../clientMapper');
const createTestClient = require('../../controller/__tests__/client.fixture')

test('Modifica los datos para que sea compatible con la entidad', async () => {
    const clientWithoudId = createTestClient();
    const clientEntity = fromDataToEntity(clientWithoudId);
    expect(clientEntity).toHaveProperty('email');
});

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
           toJSON() {
               return {}
           }, 
        })
    ).toBeInstanceOf(ClientEntity);
});

