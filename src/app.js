require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
require('./module/agency/passport/local-auth');

const port = process.env.PORT || 8080;
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));


nunjucks.configure('src/module', {
    autoescape: true,
    express: app
});

// Middleware


const ONE_WEEK_IN_SECONDS = 604800000;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS }
}));

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

// Routes
app.use('/', require('./module/agency/routes/index'));
// Routes

app.listen(port, () => {
    console.log(`Aplicacion escuchando en el puerto http://localhost:${port}/`);
});
