const express = require("express");
const {Authenticate} = require("../../Utils/UtilsFunction");
const {CreatePost, DeletePost, GetPost, Reaction, NewComment, GetComments, DeleteComment, EditComment} = require("./PostsController");
const PostsRouter = express.Router();

PostsRouter.post("/new", Authenticate, CreatePost);
PostsRouter.delete("/delete", Authenticate, DeletePost);
PostsRouter.get("/get_post", Authenticate, GetPost);
PostsRouter.post("/reaction", Authenticate, Reaction);
PostsRouter.post("/new_comment", Authenticate, NewComment);
PostsRouter.get("/get_comment", Authenticate, GetComments);
PostsRouter.delete("/delete_comment", Authenticate, DeleteComment);
PostsRouter.post("/edit_comment", Authenticate, EditComment);

module.exports = PostsRouter;
