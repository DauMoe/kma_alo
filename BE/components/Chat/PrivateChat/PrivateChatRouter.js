const express = require("express");
const { Authenticate } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatID, CreateNewPrivateChat} = require("./PrivateChatController");
const PrivateChatRouter = express.Router();

PrivateChatRouter.get("/all_private_chat/:uid", Authenticate, GetAllPrivateChatID);
PrivateChatRouter.post("/new_private_chat", Authenticate, CreateNewPrivateChat);

module.exports = PrivateChatRouter;