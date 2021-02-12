const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const saveUser = require('../sqlite/sqlite');
const getUserById = require('../sqlite/sqlite')

passport.serializeUser((user, done) => {
    console.log({user});
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
   const user = await getUserById(id);
   done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = req.body;
    await saveUser(user);
    done(null, user);
}));
