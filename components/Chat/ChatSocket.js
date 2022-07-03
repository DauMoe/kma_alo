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

    PrivateChatNSP.on(ChatEventKey.CONN, function(socket) {
        //Handle when having a connection
        console.log("A client connected");
        /**
         * @PARAMS:
         * - emit_event_id: client emit id <=> listen server id
         * - listen_event_id: client listen id <=> emit server id
         * */

        socket.on(ChatEventKey.OPEN_CHAT_EMIT, function (data) {
            console.log(data);
            if (typeof(data) === "object") {
                const { emit_event_id, listen_event_id } = data;
                console.log(emit_event_id, listen_event_id)
                socket.on(emit_event_id, function(msg) {
                    console.log(msg);
                    socket.emit(listen_event_id, msg);
                });
            } else {
                console.error("Request data is invalid")
            }
        });
    });
}

exports.RoomChatSocket = function(io) {
    const RoomChatNSP = io.of("/room");
    RoomChatNSP.use(SocketAuthenticate);
    RoomChatNSP.on(ChatEventKey.CONN, function(socket) {
    });
}