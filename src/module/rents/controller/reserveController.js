const { fromDataToEntity } = require('../mapper/reserveMapper');
const getCurrentDate = require('../service/functions')
const AbstractController = require('./abstractController');
const CarNotDefinedError = require('../../cars/service/error/carNotDefinedError');

const { paths } = require('./paths/paths');
const { resData } = require('../../data/resData');

module.exports = class RentsController extends AbstractController {
    /**
     * @param {import('../service/reserveService')} rentService
     * @param {import('../../cars/service/carsService')} carsService
     * @param {import('../../clients/service/clientsService')} clientsService
     */
    constructor(rentService, carsService, clientsService) {
        super();
        this.rentService = rentService;
        this.carsService = carsService;
        this.clientsService = clientsService
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect(paths.login.path);
        };

        // home
        app.get(paths.index.path, this.index.bind(this));

        // rent-a-car
        app.get(paths.list.path,this.list.bind(this));
        app.get(paths.create.path, isAuthenticated,this.form.bind(this));
        app.post(paths.create.path, isAuthenticated, this.save.bind(this));

        // client-reserves
        app.get(paths.reserve.client.selector.path, this.client_selector.bind(this));
        app.get(paths.reserve.list.path, this.client_reserves.bind(this));
        app.get(paths.reserve.delete.path, isAuthenticated, this.delete_reserve.bind(this));
        app.get(paths.reserve.update.path, isAuthenticated, this.view_reserve.bind(this));
        app.post(paths.create.path, isAuthenticated, this.update_reserve.bind(this));
        app.get(paths.reserve.pay.path, isAuthenticated, this.pay.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async index(req, res) {
        const { errors, messages } = req.session;   
        res.render(paths.index.render, { resData, errors, messages });
        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async list(req, res) {
        const { errors, messages } = req.session;
        req.session.current_url = paths.list.path;
        console.log(req.session.current_url)
        const car = await this.carsService.getAllCars();
        const reserve = true;
        res.render(paths.list.render, { data: { car, reserve }, resData, errors, messages });
        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async form(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }
        try {
            let currentDate = getCurrentDate();
            const car = await this.carsService.getCarById(id);
            const clients = await this.clientsService.getAllClients();
            res.render(paths.create.render, { currentDate, data: { car, clients }, resData })
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save(req, res) {
        try {
            const reserve = fromDataToEntity(req.body);
            const savedReserve = await this.rentService.rentCar(reserve);
            if (reserve.id) {
                req.session.messages = [`La reserva N°: ${reserve.id} se actualizó correctamente`];
            } else {
                req.session.messages = [`La reserva N°: ${savedReserve.id} fue creada`];
            }
            res.redirect(paths.reserve.list.redirect(reserve.Client.id));
        } catch (e) {
            req.session.errors = [e.messages, e.stack];
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async client_selector(req, res) {
        req.session.current_url = paths.reserve.client.selector.path;

        try {
            const client = await this.clientsService.getAllClients();
            res.render(paths.reserve.client.selector.render, { data: { client }, resData })
        } catch (e) {
            req.session.errors = [e.messages, e.stack];
            res.redirect(paths.list.path);
        }
        
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async client_reserves(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        req.session.current_url = paths.reserve.list.redirect(id);
        const { errors, messages } = req.session; 

        try {
            const reserve = await this.rentService.getUserReserve(id);     
            res.render(paths.reserve.list.render, { data: { reserve }, resData, errors, messages })
        } catch (e) {
            console.log(e);
        }

        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_reserve(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        try {
            const reserve = await this.rentService.getReserveById(id);
            await this.rentService.deleteReserve(reserve);
            req.session.messages = [`La reserva con ID: ${reserve.id} fue eliminada correctamente`];
            res.redirect(paths.reserve.delete.redirect(reserve.Client.id))
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async view_reserve(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        try {
            let currentDate = getCurrentDate();
            const reserve = await this.rentService.getReserveById(id);
            res.render(paths.create.render, { currentDate, data: { reserve }, resData });
        } catch (e) {
            console.log(e);
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_reserve(req, res) {
        try {
            const reserve = fromDataToEntity(req.body);
            await this.rentService.rentCar(reserve);
            res.redirect(paths.reserve.list.redirect(reserve.Client.id));
        } catch (e) {
            console.log(e);
            res.redirect(paths.reserve.client.selector.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async pay(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        const { current_url } = req.session;
        await this.rentService.changePayStatus(id);
        res.redirect(current_url);
        
    }
}
