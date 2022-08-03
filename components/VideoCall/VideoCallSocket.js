const {SocketAuthenticate} = require("../../Utils/UtilsFunction");
exports.VideoCallSocket = async(io) => {
    const VideoCallNSP = io.of("/video_call");
    VideoCallNSP.use(SocketAuthenticate);
    VideoCallNSP.adapter.on("create-room", function(room) {
        console.log(`CALL-Room ID: '${room}' is created!`);
    });

    VideoCallNSP.adapter.on("join-room", function(room, id) {
        console.log(`CALL: A user joins  room '${room}'`);
    });

    VideoCallNSP.on("connection", function(socket) {
        socket.on("join_call", function({room_name}) {
            socket.join(room_name);
        })

        VideoCallNSP.on("emit_stream", function(room_name, stream, userInfo, userId) {
            console.log(`CALL: User ID '${userId}' just emit new stream`);
            socket.to(room_name).emit("listen_add_stream", {
                user    : userInfo,
                stream  : stream,
                id      : userId || -1
            });
        });
    });
}
