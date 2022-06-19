const express = require("express");
const { Authenticate } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatID } = require("./PrivateChatController");
const PrivateChatRouter = express.Router();

PrivateChatRouter.get("/all_private_chat/:uid", Authenticate, GetAllPrivateChatID);

module.exports = PrivateChatRouter;