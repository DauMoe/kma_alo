const express       = require("express");
const app           = express();
const cors          = require("cors");
const { HOST_PORT, HOST_ADDRESS } = require("./Utils/UtilsFunction");
const UsersRouter = require("./components/users/UsersRouter");
const passport = require("passport");
const expressSession = require("express-session");

app.use(cors());
app.use(express.json());
app.use(expressSession({secret: "daumoe"}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", UsersRouter);

app.listen(HOST_PORT, function() {
    console.log(`Server is running at: http://${HOST_ADDRESS}`);
})