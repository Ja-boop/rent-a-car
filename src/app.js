require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const flash = require('connect-flash');

const configureDependecyInjection = require('./config/di'); 
const { init: initAgencyModule } = require('./module/agency/module');

const app = express();
const port = process.env.PORT || 8080;

require('./module/agency/passport/local-auth');

app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));


nunjucks.configure('src/module', {
    autoescape: true,
    express: app
});

// Middleware
const container = configureDependecyInjection(app);
app.use(container.get('Session'));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.identEmailMessage = req.flash('identEmailMessage');
    app.locals.userNotDefinedMessage = req.flash('userNotDefinedMessage');
    app.locals.passwordMessage = req.flash('passwordMessage');
    app.locals.carCreationErrorMessage = req.flash('carCreationErrorMessage');
    app.locals.user = req.user;
    next();
});

initAgencyModule(app, container);

const agencyController = container.get('AgencyController');
app.get('/', agencyController.index.bind(agencyController));

app.listen(port, () => {
    console.log(`Aplicacion escuchando en el puerto http://localhost:${port}/`);
});
