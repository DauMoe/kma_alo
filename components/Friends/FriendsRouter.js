const express = require("express");
const {Authenticate} = require("../../Utils/UtilsFunction");
const {RecommendNewFriends, GetListFriends, SearchFriend, AddFriend, CancelRequest, AcceptFriendRequest} = require("./FriendsController");
const FriendsRouter = express.Router();

FriendsRouter.post("/recommend_new_friends", Authenticate, RecommendNewFriends);
FriendsRouter.get("/list", Authenticate, GetListFriends);
FriendsRouter.get("/search", Authenticate, SearchFriend);
FriendsRouter.post("/add_friend", Authenticate, AddFriend);
FriendsRouter.delete("/cancel_request", Authenticate, CancelRequest);
FriendsRouter.post("/accept_request", Authenticate, AcceptFriendRequest);

module.exports = FriendsRouter;
