require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
require('./passport/local-auth');

const port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));


nunjucks.configure('src/views', {
    autoescape: true,
    express: app
});

// Middleware
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, process.env.CARIMAGE_UPLOAD_DIR);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

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
    app.locals.user = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index'));
// Routes

app.listen(port, () => {
    console.log(`Aplicacion escuchando en el puerto http://localhost:${port}/`);
});
