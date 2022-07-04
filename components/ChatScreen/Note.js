//----------------- CLIENT SIDE --------------------
import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

//Catch all lister (DEV)
socket.onAny((event, ...args) => {
    console.log(event, args);
});

//
const onUsernameSelection = function(username) {
    this.usernameAlreadySelected = true;
    socket.auth = { username };
    socket.connect();
}

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
    }
});

//----------------- SERVER SIDE --------------------
const PrivateChatNSP = io.of("/private");
PrivateChatNSP.on(ChatEventKey.CONN, function(socket) {
    const ListUsers = [];
    for(const [id, socket] of PrivateChatNSP.sockets) {
        ListUsers.push({
            userID: id
        });
    }
    socket.emit("users", ListUsers);
    socket.on("private_chat", function({msg, to}) {
        console.log(socket);
        socket.to(to).emit("private_chat", {
            msg,
            from: socket.id,
            from_uid: socket.handshake.query.userID
        })
    });
});

