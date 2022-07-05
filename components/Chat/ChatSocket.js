const { SocketAuthenticate, ChatEventKey } = require("../../Utils/UtilsFunction");

const CheckRequireField = function(socket, next) {
    console.log(socket);
};

const CreateNewPrivateChatSocket = function(socket, private_chat_id) {
    socket.on(private_chat_id, function(msg) {
        console.log(msg);
        //Send all except the sender
        // socket.broadcast.emit("hello", "world");

        //Send all include the sender
        socket.emit(private_chat_id, msg);
    });
}

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

        socket.on("emit_private_chat", function(msg) {
            const { room_name, content } = msg;
            socket.to(room_name).emit("listen_private_chat", content);
        });
    });
}

exports.RoomChatSocket = function(io) {
    const RoomChatNSP = io.of("/room");
    RoomChatNSP.use(SocketAuthenticate);
    RoomChatNSP.on(ChatEventKey.CONN, function(socket) {});
}