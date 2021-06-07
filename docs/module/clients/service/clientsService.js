/**
 * @typedef {import('../repository/orm/abstract/abstractClientsRepository')} abstractClientsRepository
*/

const Client = require('../entity/client');
const ClientNotDefinedError = require('./error/clientNotDefinedError');
const ClientIdNotDefinedError = require('./error/clientIdNotDefinedError');

module.exports = class ClientsService {
    /**
     * @param {abstractClientsRepository} clientsRepository
     */
     constructor(clientsRepository) {
        this.clientsRepository = clientsRepository
    }

    /**
     * @param {Client} client
     */
    async saveClient(client) {
        if (client === undefined) {
            throw new ClientNotDefinedError();
        }
        return this.clientsRepository.saveClient(client)
    }

    async getClientById(id) {
        if (id === undefined) {
            throw new ClientIdNotDefinedError();
        }

        return this.clientsRepository.getClientById(id);
    }

    /**
     * @param {Client} client
     */
    async deleteClient(client) {
        if(!(client instanceof Client)) {
            throw new ClientNotDefinedError();
        }

        return this.clientsRepository.deleteClient(client);
    }

    async getAllClients() {
        return this.clientsRepository.getAllClients();
    }

}
