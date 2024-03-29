const AbstractClientsRepository = require('../orm/abstract/abstractClientsRepository');
const { fromModelToEntity } = require('../../mapper/clientMapper');
const ClientNotFoundError = require('./error/clientNotFoundError');
const ClientIdNotDefinedError = require('./error/clientIdNotDefinedError');

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
            throw new ClientIdNotDefinedError();
        }
        return Boolean(await this.clientModel.destroy({ where: { id: client.id } }));
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/rent')>}
     */
    async getClientById(id) {
        const clientModel = await this.clientModel.findOne({
            where: { id },
        });

        if (!clientModel) {
            throw new ClientNotFoundError()
        }

        return fromModelToEntity(clientModel);
    }

    async getAllClients() {
        const clients = await this.clientModel.findAll();
        
        if(clients.length === 0) {
            throw new Error('The length of Clients is 0')
        } else {
            return clients.map(fromModelToEntity);
        }
        
    }
}
