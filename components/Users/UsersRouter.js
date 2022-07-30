const express = require("express");
const { Authenticate } = require("../../Utils/UtilsFunction");
const { NewLocalUser, CheckRequiredLoginField, AuthenticateSuccess, GetUserInfo, VerifyAccount, UpdateUserInfo,
    UpdateAvatar, TokenValid
} = require("./UsersController");
const UsersRouter = express.Router();
require("../Passport/PassportJsonInit");
require("../Passport/PassportJsonInit");
const {PassportJsonAuthenticate} = require("../Passport/PassportJsonInit");

UsersRouter.post("/local_signup", Authenticate, NewLocalUser);
UsersRouter.post("/local_login", CheckRequiredLoginField, PassportJsonAuthenticate, AuthenticateSuccess);
UsersRouter.get("/info", Authenticate, GetUserInfo);
UsersRouter.get("/verify/:uuid", VerifyAccount);
UsersRouter.get("/info", Authenticate, GetUserInfo);
UsersRouter.put("/user_info", Authenticate, UpdateUserInfo);
UsersRouter.put("/avatar", Authenticate, UpdateAvatar);
UsersRouter.get("/check_valid", Authenticate, TokenValid);

module.exports = UsersRouter;