/**
 * @typedef {import('../repository/orm/abstract/abstractClientsRepository')} abstractClientsRepository
*/

const Client = require('../entity/client');

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
            throw new console.error('Client is not defined');
        }
        return this.clientsRepository.saveClient(client)
    }

    async getClientById(id) {
        if (id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.clientsRepository.getClientById(id);
    }

    /**
     * @param {Client} client
     */
    async deleteClient(client) {
        if(!(client instanceof Client)) {
            throw new console.error();
        }

        return this.clientsRepository.deleteClient(client);
    }

    async getAllClients() {
        return this.clientsRepository.getAllClients();
    }

}
