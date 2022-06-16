const { NewLocalUser, AuthenticateError, LocalAuthenticate } = require("./UsersController");

const express = require("express");
const passport = require("passport");
const { Authenticate } = require("../../Utils/UtilsFunction");
const UsersRouter = express.Router();

UsersRouter.get("/local_login_fail", AuthenticateError);
UsersRouter.post("/local_signup", Authenticate, NewLocalUser);
UsersRouter.post("/local_login", passport.authenticate('local', {failureRedirect: '/users/local_login_fail'}), LocalAuthenticate);

module.exports = UsersRouter;