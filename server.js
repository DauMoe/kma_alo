const express       = require("express");
const app           = express();
const httpServer    = require("http").Server(app);
const cors          = require("cors");
const path          = require("path");
const passport      = require("passport");
const io            = require("socket.io")(httpServer);
const fs            = require("fs");
const { HOST_PORT, HOST_ADDRESS } = require("./Utils/UtilsFunction");
const { PrivateChatSocket, RoomChatSocket } = require("./components/Chat/ChatSocket");
const UsersRouter = require("./components/Users/UsersRouter");
const PrivateChatRouter = require("./components/Chat/PrivateChat/PrivateChatRouter");
const FriendsRouter = require("./components/Friends/FriendsRouter");
const PostsRouter = require("./components/Posts/PostsRouter");
require("dotenv").config();

if (!fs.existsSync("public/avatar")) {
    fs.mkdirSync("public/avatar");
}

if (!fs.existsSync("public/post")) {
    fs.mkdirSync("public/post");
}

const RootNSP = io.of("/");
RootNSP.use(function(socket, next) {
    next(new Error("Cannot connect to this namespace"));
});

PrivateChatSocket(io);
RoomChatSocket(io);

app.use(cors());
app.use(express.json({
    limit: '50mb'
}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/is_ok", (req, resp) => {
    resp.send("We good");
});

app.use("/users", UsersRouter);
app.use("/private_chat", PrivateChatRouter);
app.use("/friends", FriendsRouter);
app.use("/posts", PostsRouter);

httpServer.listen(HOST_PORT, function() {
    console.log(`Host IP: '${HOST_ADDRESS}'`);
})