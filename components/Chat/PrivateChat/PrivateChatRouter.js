const express = require("express");
const { Authenticate } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatID, CreateNewPrivateChat, GetMessageHistory} = require("./PrivateChatController");
const PrivateChatRouter = express.Router();

PrivateChatRouter.get("/all", Authenticate, GetAllPrivateChatID);
PrivateChatRouter.get("/history", Authenticate, GetMessageHistory);
PrivateChatRouter.post("/new", Authenticate, CreateNewPrivateChat);

module.exports = PrivateChatRouter;