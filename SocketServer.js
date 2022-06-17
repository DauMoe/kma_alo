const express = require("express");
const app = express();
const server = require("http").Server(app);
const PORT = 8000;
const io = require("socket.io")(server);

server.listen(PORT, function() {
    console.log("RUNNING...");
});

// io.use(function(socket, next) {
//     const username = socket.handshake;
//     console.log("UN");
//     next();
// });


//Passport + SocketIO: https://socket.io/docs/v4/middlewares/
// io.use(wrap(session({ secret: "cats" })));
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()));

var freetuts = io.of("/");
//Chi định namespace có tên /freetuts
freetuts.on("connection", function(socket) {
  console.log("Một người vừa kết nối.");
 
  //Nhận yêu cầu vào phòng từ clients
  socket.on("join", function(data) {
    //THam gia phòng
    socket.join("freetutsRoom");
    //Trả lại thông báo cho người vào phòng
    socket.emit("notification", "Bạn đã tham gia vào phòng");
 
    //Trả lại thông báo cho tất cả người còn lại trong phòng
    freetuts.to("freetutsRoom").emit("notification", "Một người đã vào phòng.");
  });
 
  //Nhận yêu cầu rời phòng từ clients
  socket.on("leave", function(data) {
    //Rời phòng
    socket.leave("freetutsRoom");
    //Trả lại thông báo cho người vào phòng
    socket.emit("notification", "Bạn đã rời phòng");
    //Trả lại thông báo cho tất cả người trong phòng
    freetuts.to("freetutsRoom").emit("notification", "Một người đã rời phòng.");
  });

  socket.on("sendRoomMsg", function(data) {
    freetuts.to("freetutsRoom").emit("receivedRoomMsg", data);
  });
});




