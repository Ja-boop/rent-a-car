const { fromDataToEntity } = require('../mapper/carMapper');
const AbstractController = require('./abstractController');


module.exports = class CarsController extends AbstractController {
    /**
     * @param {import('../service/carsService')} carsService
     */
    constructor(uploadMiddleware, carsService) {
        super();
        this.ROUTE_BASE = '/agency';
        this.uploadMiddleware = uploadMiddleware;
        this.carsService = carsService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;

        app.get(`${ROUTE}/car/list`, this.car_list.bind(this));
        app.get(`${ROUTE}/create/car`, this.car_form.bind(this));
        app.post(`${ROUTE}/create/car`, this.uploadMiddleware.single('image-url'), this.save_car.bind(this));
        app.get(`${ROUTE}/delete/car/:id`, this.delete_car.bind(this));
        app.get(`${ROUTE}/view/car/:id`, this.update_car.bind(this));

    }


    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async car_list(req, res) {
        const car = await this.carsService.getAllCars();
        res.render('cars/view/list.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async car_form(req, res) {
        res.render('cars/view/form.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save_car(req, res) {
        try {
            const car = fromDataToEntity(req.body);
            console.log(req.body)
            if (req.file) {
                const { path } = req.file;
                car.imageUrl = path;    
            }
            const savedCar = await this.carsService.saveCar(car);
            if (car.id) {
                console.log(`El vehículo con el ID: ${car.id} se actualizo correctamente`);
            } else {
                console.log(`Se creo el vehículo con ID: ${savedCar.id} (${savedCar.brand}, ${savedCar.model})`);
            }
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_car(req, res) {
        try {
            const { id } = req.params;
            const car = await this.carsService.getCarById(id);
            await this.carsService.deleteCar(car);
            console.log('carDeletedMessage', `El vehículo con ID: ${car.id} (${car.brand}, ${car.model}) fue eliminado correctamente`);
        } catch (e) {
            console.log(e);
        }
        res.redirect(`${this.ROUTE_BASE}/car/list`)
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_car(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`No se encontro el vehículo con el ID`)
        }
        try {
            const car = await this.carsService.getCarById(id);
            res.render('cars/view/form.njk', { data: { car } });
        } catch (e) {
            console.log(e);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }
}
