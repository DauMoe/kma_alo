const { SocketAuthenticate, ChatEventKey } = require("../../Utils/UtilsFunction");
const {SavePrivateMessageToDB} = require("./PrivateChat/PrivateChatController");

exports.PrivateChatSocket = function(io) {
    const PrivateChatNSP = io.of("/private");

    PrivateChatNSP.use(SocketAuthenticate);
    PrivateChatNSP.adapter.on("create-room", function(room) {
        console.log(`CHAT: ${room} is created!`);
    });

    PrivateChatNSP.adapter.on("join-room", function(room, id) {
        console.log(`CHAT: User ${id} joins room ${room}`);
    });

    PrivateChatNSP.on("connection", function(socket) {
        socket.on("join_chat", function({room_name}) {
            socket.join(room_name);
        })

        socket.on("emit_private_chat", async function(room_name, msg, receiver_id, chatInfo) {
            const result = await SavePrivateMessageToDB(room_name, socket.senderInfo.uid, receiver_id, msg);
            if (result.code === 200) {
                socket.to(room_name).emit("listen_private_chat", {
                    ...chatInfo,
                    msg: msg,
                    code: 200
                });
            } else {
                socket.to(room_name).emit("listen_private_chat", {
                    ...chatInfo,
                    result
                });
            }
        });
    });
}

exports.PrivateCallSocket = function(io) {
    const PrivateCallNSP = io.of("/private_call");

    PrivateCallNSP.use(SocketAuthenticate);
    PrivateCallNSP.adapter.on("create-room", function(room) {
        console.log(`CALL: ${room} is created!`);
    });

    PrivateCallNSP.adapter.on("join-room", function(room, id) {
        console.log(`CALL: User ${id} joins room ${room}`);
    });

    PrivateCallNSP.on("connection", function(socket) {
        socket.on("join_call", function({room_name}) {
            socket.join(room_name);
        })

        socket.on("user_join_call", async function(room_name, peerID, userInfo) {
            console.log("Room: ", room_name, " ID: ", peerID);
            socket.to(room_name).emit("new_user_joined", peerID, userInfo);
        });

        socket.on("end_call", function(room_name) {
            socket.to(room_name).emit("end_call_remote_side");
        });
    });
}

exports.RoomChatSocket = function(io) {
    const RoomChatNSP = io.of("/room");
    RoomChatNSP.use(SocketAuthenticate);
    RoomChatNSP.on(ChatEventKey.CONN, function(socket) {});
}
