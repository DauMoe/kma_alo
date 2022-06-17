const express = require("express");
const app = express();
const server = require("http").Server(app);
const PORT = 8000;
const io = require("socket.io")(server);

server.listen(PORT, function() {
    console.log("RUNNING...");
});

io.use(function(socket, next) {
    const username = socket.handshake;
    // console.log(username, "UN");
    next();
});

let i = 0;

io.on("connection", function(socket) {
    console.log("An event is emitted!");
    socket.on("user_one_two_private_chat", function(msg) {
        console.log(msg);
        socket.emit("user_one_two_private_chat", {msg: "go go go "})
    });
});




