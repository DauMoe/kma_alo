const express       = require("express");
const app           = express();
const cors          = require("cors");
const { HOST_PORT, HOST_ADDRESS } = require("./Utils/UtilsFunction");
const UsersRouter = require("./components/users/UsersRouter");
const passport = require("passport");
const expressSession = require("express-session");
const flash = require("connect-flash");
const MAX_AGE_SESSION = 1000 * 60 * 60 * 1;

app.use(cors());
app.use(express.json());
app.use(expressSession({saveUninitialized: false, secret: "daumoe", cookie: {maxAge: MAX_AGE_SESSION, secure: true}, resave: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session({saveUninitialized: false, secret: "daumoe", cookie: {maxAge: MAX_AGE_SESSION, secure: true}, resave: false}));

app.use("/users", UsersRouter);

app.listen(HOST_PORT, function() {
    console.log(`Server is running at: http://${HOST_ADDRESS}`);
})