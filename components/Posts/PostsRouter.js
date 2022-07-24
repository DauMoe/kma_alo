const express = require("express");
const {Authenticate} = require("../../Utils/UtilsFunction");
const {CreatePost, DeletePost, GetPost} = require("./PostsController");
const PostsRouter = express.Router();

PostsRouter.post("/new", Authenticate, CreatePost);
PostsRouter.delete("/delete", Authenticate, DeletePost);
PostsRouter.get("/get_post", Authenticate, GetPost);

module.exports = PostsRouter;