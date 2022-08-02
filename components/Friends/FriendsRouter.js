const express = require("express");
const {Authenticate} = require("../../Utils/UtilsFunction");
const {RecommendNewFriends, GetListFriends, SearchFriend} = require("./FriendsController");
const FriendsRouter = express.Router();

FriendsRouter.post("/recommend_new_friends", Authenticate, RecommendNewFriends);
FriendsRouter.get("/list", Authenticate, GetListFriends);
FriendsRouter.get("/search", Authenticate, SearchFriend);

module.exports = FriendsRouter;
