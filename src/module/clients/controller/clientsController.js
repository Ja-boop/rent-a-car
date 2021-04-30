const { fromDataToEntity } = require('../mapper/clientMapper');
const AbstractController = require('./abstractController');

module.exports = class ClientsController extends AbstractController {
    /**
     * @param {import('../service/clientsService')} clientsService
     */
    constructor(clientsService) {
        super();
        this.ROUTE_BASE = '/agency';
        this.clientsService = clientsService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;
        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect(`${ROUTE}/login`)
        };

        app.get(`${ROUTE}/create/client`, this.create.bind(this));  
        app.post(`${ROUTE}/create/client`, this.save.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        res.render('clients/view/form.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save(req, res) {
        try {
            console.log( req.body );
            const client = fromDataToEntity(req.body);
            console.log(client)
            const savedClient = await this.clientsService.saveClient(client);
            if (client.id) {
                req.flash('updateClientMessage', `El cliente con el ID: ${client.id} se actualizo correctamente`);
            } else {
                req.flash('newClientCreatedMessage', `Se creo el cliente con ID: ${savedClient.id}`);
            }
            res.redirect(`${this.ROUTE_BASE}/`);
        } catch (e) {
            console.log(e);
            req.flash('clientCreationErrorMessage', `${e}`);
            res.redirect(`${this.ROUTE_BASE}/`);
        }
    }
}
