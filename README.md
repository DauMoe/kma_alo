## Design  
 - [NewsFeed Design](https://dribbble.com/tags/newsfeed)
 - [Login Screen Design](https://thumbs.dreamstime.com/z/mockup-screen-login-form-welcome-page-your-mobile-app-interface-design-login-page-mockup-screen-login-form-welcome-199562898.jpg)
 - [Chat Screen Design 1](https://assets.materialup.com/uploads/2c557a48-77e8-4ccc-9573-97a2509f3b07/preview.png)
 - [Chat Screen Design 2](https://i.pinimg.com/736x/1f/b9/49/1fb94995bae04dc1103c8174956ac70c.jpg)

## Documentation
 - [RN Navigation](https://reactnative.dev/docs/navigation)
 - [RN Paper Icons](https://materialdesignicons.com/)
 - [RN Paper Theming](https://callstack.github.io/react-native-paper/theming.html)
 - [RN Paper FAB](https://callstack.github.io/react-native-paper/animated-fab.html)
 - [RN Paper Bottom Navigation](https://callstack.github.io/react-native-paper/bottom-navigation.html)
 - [RN Paper Custom font](https://callstack.github.io/react-native-paper/fonts.html)
 
## TODO Jun 26 2022:
 - [x] Use local DB stores host IP
 - [ ] Create chat UI
 - [ ] Create Profile UI
 - [ ] Create search friend UI
 - [ ] Create comments UI
## Socket idea:  
 - Use `rooms` to make private chat
 - Example:
   - `const PrivateChatNSP = io.of("/private");
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
     });`