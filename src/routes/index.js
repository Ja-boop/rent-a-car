const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ROUTE = '/agency';
const { fromDataToEntity } = require('../mapper/carMapper');
const { saveCar, deleteCar, getCarById, getAllCars } = require('../sqlite/crudCarSqlite');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, process.env.CARIMAGE_UPLOAD_DIR);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage })

router.get('/', (req, res, next) => {
    res.render('home.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});


// user authentication
router.get(`${ROUTE}/signup`, (req, res, next) => {
    res.render('signup.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post(`${ROUTE}/signup`, passport.authenticate('local-signup', {
    successRedirect: `${ROUTE}/profile`,
    failureRedirect: `${ROUTE}/signup`,
    passReqToCallback: true
}));

router.get(`${ROUTE}/login`, (req, res, next) => {
    res.render('login.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post(`${ROUTE}/login`, passport.authenticate('local-login', {
    successRedirect: '/agency/profile',
    failureRedirect: '/agency/login',
    passReqToCallback: true
}));


// profile
router.get(`${ROUTE}/profile`, isAuthenticated, (req, res, next) => {
    res.render('profile.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.get(`${ROUTE}/logout`, (req, res, next) => {
    req.logOut();
    res.redirect('/')
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect(`${ROUTE}/login`)
};


// rent a car
router.get(`${ROUTE}/car/list`, async (req, res) => { // Lista de vehículos
    const car = await getAllCars();
    res.render('list.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
});

router.get(`${ROUTE}/create/car`, (req, res) => { // Form para creación de vehículos
    res.render('form.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
});

router.post(`${ROUTE}/create/car`, upload.single('image_url'), async (req, res) => { 
    try {
        const car = fromDataToEntity(req.body);
        console.log(req.body);
        if (req.file) {
            const { path } = req.file;
            car.imageUrl = path;
        }
        const savedCar = await saveCar(car);
        if (car.id) {
            req.flash('updateCarMessage', `El vehículo con el ID: ${car.id} se actualizo correctamente`);
        } else {
            req.flash('newCarCreatedMessage', `Se creo el vehículo con ID: ${savedCar.id} (${savedCar.brand}, ${savedCar.model})`);
        }
        res.redirect(`${ROUTE}/car/list`);
    } catch (e) {
        console.log(e);
        req.flash('carCreationErrorMessage', `${e}`);
        res.redirect(`${ROUTE}/car/list`);
    }
});

router.get(`${ROUTE}/delete/car/:id`, async (req, res) => { // Eliminar el vehículo
    try {
        const { id } = req.params;
        const car = await getCarById(id);
        console.log(car);
        await deleteCar(car);
        req.flash('carDeletedMessage', `El vehículo con ID: ${car.id} (${car.brand}, ${car.model}) fue eliminado correctamente`);
    } catch (e) {
        req.flash('carDeletedErrorMessage', e);
    }
    res.redirect(`${ROUTE}/car/list`)
});

router.get(`${ROUTE}/view/car/:id`, async (req, res) => {
    const { id } = req.params;
    if(!id) {
        throw new Error(`No se encontro el vehículo con el ID: ${id}`)
    }
    try {
        const car = await getCarById(id);
        console.log(car);
        res.render('form.njk', { data: { car } });
    } catch (e) {
        req.flash('viewCarErrorMessage', e);
        res.redirect(`${ROUTE}/car/list`);
    }
});

module.exports = router;
