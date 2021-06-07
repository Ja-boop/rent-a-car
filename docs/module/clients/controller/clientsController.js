const { fromDataToEntity } = require('../mapper/clientMapper');
const AbstractController = require('./abstractController');
const resData = require('./../../data/resData');
const { paths } = require('./paths/paths');

module.exports = class ClientsController extends AbstractController {
    /**
     * @param {import('../service/clientsService')} clientsService
     */
    constructor(clientsService) {
        super();
        this.clientsService = clientsService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        app.get(paths.create.path, this.create.bind(this));  
        app.post(paths.create.path, this.save.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        req.session.current_url = paths.create.path;
        res.render(paths.create.render, resData);
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save(req, res) {
        try {
            const client = fromDataToEntity(req.body);
            console.log(client)
            const savedClient = await this.clientsService.saveClient(client);
            if (client.id) {
                req.session.messages = [`El cliente con el ID: ${client.id} se actualizo correctamente`];
            } else {
                req.session.messages = [`Se creo el cliente con ID: ${savedClient.id}`];
            }
            res.redirect(paths.index);
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect(paths.index);
        }
    }
}
