const AbstractClientsRepository = require('../orm/abstract/abstractClientsRepository');
const { fromModelToEntity } = require('../../mapper/clientMapper');

module.exports = class ClientsRepository extends AbstractClientsRepository {
    /**
     * @param {typeof import('../../model/clientModel')} clientModel
     */
    constructor(clientModel) {
        super();
        this.clientModel = clientModel;
    }

    /**
     * @param {typeof import('../../entity/client')} client
     * @returns {Promise<import('../../entity/client')>}
     */
    async saveClient(client) {
        let clientModel;

        const buildOptions = { isNewRecord: !client.id };
        clientModel = this.clientModel.build(client, buildOptions);
        clientModel = await clientModel.save();

        return fromModelToEntity(clientModel);
    }

    /**
     * @param {typeof import('../../entity/client')} client
     * @returns {Boolean}
     */
    async deleteClient(client) {
        if(!client || !client.id) {
            throw new Error('Id not defined')
        }
        return Boolean(await this.clientModel.destroy({ where: { id: client.id } }));
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getClientById(id) {
        const client = await this.clientModel.findOne({
            where: { id },
        });

        if (!client) {
            throw new Error(`Reserve with id: ${id} was not found`)
        }

        return client.map(fromModelToEntity);
    }
}
