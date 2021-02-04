require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize());
app.use(passport.session());

nunjucks.configure('src/views', {
    autoescape: true,
    express: app
});

//Routes
app.use('/', require('./routes/index'));
//Routes

//Configurar dependencias
//session
const ONE_WEEK_IN_SECONDS = 604800000;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS }
}));
//session

//multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, process.env.CARIMAGE_UPLOAD_DIR);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })
//multer


//Configurar dependencias

app.listen(port, () => {
    console.log(`Aplicacion escuchando en el puerto http://localhost:${port}/`);
});
