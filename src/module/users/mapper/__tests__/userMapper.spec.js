/// <reference types="Jest" />

const UserEntity = require('../../entity/user');
const { fromModelToEntity } = require('../userMapper');

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
           toJSON() {
               return {}
           }, 
        })
    ).toBeInstanceOf(UserEntity);
});
