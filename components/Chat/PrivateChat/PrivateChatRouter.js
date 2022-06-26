const express = require("express");
const { Authenticate } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatID, CreateNewPrivateChat} = require("./PrivateChatController");
const PrivateChatRouter = express.Router();

PrivateChatRouter.get("/all/:uid", Authenticate, GetAllPrivateChatID);
PrivateChatRouter.post("/new", Authenticate, CreateNewPrivateChat);

module.exports = PrivateChatRouter;