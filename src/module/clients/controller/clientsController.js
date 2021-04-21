const { fromDataToEntityClient } = require('../mapper/clientMapper');
const getCurrentDate = require('../service/functions')
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

        
    }
}
