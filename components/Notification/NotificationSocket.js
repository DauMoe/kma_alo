const {SocketAuthenticate, UNREAD} = require("../../Utils/UtilsFunction");
const {SavePrivateMessageToDB} = require("../Chat/PrivateChat/PrivateChatController");

exports.NotificationSocket = function(io) {
  const NotificationNSP = io.of("/notification");
  NotificationNSP.use(SocketAuthenticate);
  NotificationNSP.adapter.on("create-room", function(room) {
    console.log(`NOTIFICATION: ${room} is created!`);
  });

  NotificationNSP.adapter.on("join-room", function(room, id) {
    console.log(`NOTIFICATION: User ${id} joins room ${room}`);
  });

  NotificationNSP.on("connection", function(socket) {
    socket.on("join_chat", function({room_name}) {
      socket.join(room_name);
    });
    socket.on("new_message", async function(room_name, msg, senderInfo) {
      socket.to(room_name).emit("notify_new_message", msg, senderInfo);
    });
    socket.on("new_call", async function(room_name, senderInfo) {
      socket.to(room_name).emit("notify_new_call", senderInfo);
    });
  });
}
