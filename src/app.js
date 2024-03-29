require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');

const configureDependecyInjection = require('./config/di'); 
const { init: initRentsModule } = require('./module/rents/module');
const { init: initCarsModule } = require('./module/cars/module');
const { init: initUsersModule } = require('./module/users/module');
const { init: initClientsModule } = require('./module/clients/module');

const app = express();
const port = process.env.PORT || 8080;

require('./module/users/passport/local-auth');

app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));


nunjucks.configure('src/module', {
    autoescape: true,
    express: app
});

// Middleware
const container = configureDependecyInjection(app);
app.use(container.get('Session'));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});

initRentsModule(app, container);
initCarsModule(app, container);
initUsersModule(app, container);
initClientsModule(app, container);

const rentsController = container.get('ReserveController');
app.get('/', rentsController.index.bind(rentsController));

const server = app.listen(port, () => {
    console.log(`Aplicacion escuchando en el puerto http://localhost:${port}/`);
});

module.exports = { app, server };
