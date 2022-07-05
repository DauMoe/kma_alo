const { SocketAuthenticate, ChatEventKey } = require("../../Utils/UtilsFunction");

const CheckRequireField = function(socket, next) {
    console.log(socket);
};

exports.PrivateChatSocket = function(io) {
    const PrivateChatNSP = io.of("/private");

    //Disable authenticate (temp)
    // PrivateChatNSP.use(SocketAuthenticate);

    PrivateChatNSP.adapter.on("create-room", function(room) {
        console.log(`${room} is created!`);
    });

    PrivateChatNSP.adapter.on("join-room", function(room, id) {
        console.log(`User ${id} join room ${room}`);
    });

    PrivateChatNSP.on("connection", function(socket) {
        socket.on("join_chat", function({room_name}) {
            socket.join(room_name);
        })

        socket.on("emit_private_chat", function(room_name, msg, chatInfo) {
            socket.to(room_name).emit("listen_private_chat", {
                ...chatInfo,
                msg: msg
            });
        });
    });
}

exports.RoomChatSocket = function(io) {
    const RoomChatNSP = io.of("/room");
    RoomChatNSP.use(SocketAuthenticate);
    RoomChatNSP.on(ChatEventKey.CONN, function(socket) {});
}