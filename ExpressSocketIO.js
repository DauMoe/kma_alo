const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const PORT = 8000;
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, function() {console.log("et o et...")});

//Socket IO Event
const CONN = 'connection';
const CONN_ERR = 'connect_error';

//Deny all connect to root namespace
const RootNSP = io.of("/");
RootNSP.use(function(socket, next) {
    next(new Error("Not allow to connect this namespace!"));
});

//------------------- Private chat -------------------
const PrivateNSP = io.of("/private");

//Create a DB config
const PrivateChatEvent = {
    SENDED  : "SENDED",
    RECEIVED: "RECEIVED",
    READED  : "READED"
};

const AuthenticateMiddleware = function(socket, next) {
    const authoHeader = socket.handshake.headers;
    if (authoHeader.token && authoHeader.token.indexOf("Bearer") > -1) {
        next();
    } else {
        next(new Error("invalid token"));
    }
};

PrivateNSP.use(AuthenticateMiddleware);

PrivateNSP.on(CONN, function(socket) {
    console.log("(PRIVATE) A connect is created");
});