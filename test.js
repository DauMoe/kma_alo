var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');

app.use(expressSession({secret: 'daumoe'}));
app.use(passport.initialize());
app.use(passport.session({secret: "daumoe"}));


app.get('/ok', function (req, res, next) {
    console.log('login')
    if (req.isAuthenticated()) {
        res.status(200).json("authen ok");
    }
    else{
        res.status(403).json({msg: "unauthorization"});
    }
});

// app.use("*", function (req, resp, next) {
//     console.log(req);
//     next();
// });

app.get('/err', function (req, res, next) {
    res.status(403).json({msg: "authenticate fail"});
});

app.post("/local_login", passport.authenticate('local', {failureRedirect: '/err'}), function(req, resp) {
    resp.send("ok");
});

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
}, function verify(req, username, password, done) {
    console.log("?", username);
    done(null, {uid: 1});
}));

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.serializeUser((user, done) => {
    done(null, user);
});

app.listen(8080);