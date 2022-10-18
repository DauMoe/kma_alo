const express = require("express");
const { Authenticate } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatID, CreateNewPrivateChat, GetMessageHistory, GetChatInfo, NewMessage} = require("./PrivateChatController");
const PrivateChatRouter = express.Router();

PrivateChatRouter.get("/all", Authenticate, GetAllPrivateChatID);
PrivateChatRouter.get("/history", Authenticate, GetMessageHistory);
PrivateChatRouter.post("/new", Authenticate, CreateNewPrivateChat);
PrivateChatRouter.get("/chat_info", Authenticate, GetChatInfo);
PrivateChatRouter.post("/new_message", NewMessage);

module.exports = PrivateChatRouter;