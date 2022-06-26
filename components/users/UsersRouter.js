const express = require("express");
const { Authenticate } = require("../../Utils/UtilsFunction");
const { NewLocalUser, CheckRequiredLoginField, AuthenticateSuccess, GetUserInfo, VerifyAccount} = require("./UsersController");
const UsersRouter = express.Router();
require("../Passport/PassportJsonInit");
require("../Passport/PassportJsonInit");
const {PassportJsonAuthenticate} = require("../Passport/PassportJsonInit");

UsersRouter.post("/local_signup", Authenticate, NewLocalUser);
UsersRouter.post("/local_login", CheckRequiredLoginField, PassportJsonAuthenticate, AuthenticateSuccess);
UsersRouter.get("/info", Authenticate, GetUserInfo);
UsersRouter.get("/verify/:uuid", VerifyAccount);

module.exports = UsersRouter;