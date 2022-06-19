const express = require("express");
const { Authenticate } = require("../../Utils/UtilsFunction");
const { NewLocalUser, CheckRequiredLoginField, AuthenticateSuccess} = require("./UsersController");
const UsersRouter = express.Router();
require("../Passport/PassportJsonInit");
require("./../Passport/PassportJsonInit");
const {PassportJsonAuthenticate} = require("../Passport/PassportJsonInit");

UsersRouter.post("/local_signup", Authenticate, NewLocalUser);
UsersRouter.post("/local_login", CheckRequiredLoginField, PassportJsonAuthenticate, AuthenticateSuccess);

module.exports = UsersRouter;