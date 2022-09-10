## TODO Jun 26 2022:
- [x] ~~**IMPORTANT! Find a way to update offset without re-render**: (redux JUST SAVE THIS DATA from current call, update to **conversation** state and update **offset**)~~
- [x] ~~Use local DB stores host IP~~
- [x] ~~Create chat UI~~
- [x] ~~Create Profile UI~~
- [x] ~~Create search friend UI~~
- [ ] Create comments UI
- [x] ~~Create Profile UI (when user click a name -> Show all post of this person);~~
- [ ] Call UI
- [x] ~~Create Signup UI~~
- [x] ~~**Complete login scenario**~~
- [ ] Save current offset in new feeds when refresh or load more post
- [ ] **Create new API get user info and post with UID**
- [ ] **Like and comment**
- [x] ~~**Confirm delete post modal**~~
- [ ] **Show notification in bottom navigation when having new message**

## Design  
 - [NewsFeed Design](https://dribbble.com/tags/newsfeed)
 - [Login Screen Design](https://thumbs.dreamstime.com/z/mockup-screen-login-form-welcome-page-your-mobile-app-interface-design-login-page-mockup-screen-login-form-welcome-199562898.jpg)
 - [Chat Screen Design 1](https://assets.materialup.com/uploads/2c557a48-77e8-4ccc-9573-97a2509f3b07/preview.png)
 - [Chat Screen Design 2](https://i.pinimg.com/736x/1f/b9/49/1fb94995bae04dc1103c8174956ac70c.jpg)
 - [Comments Screen Design](https://cdn.dribbble.com/users/1723105/screenshots/14711373/media/46652e6e05f26b43a7c089f6c6e234f5.png?compress=1&resize=1090x1280)
 - 
## Documentation
 - [RN Navigation](https://reactnative.dev/docs/navigation)
 - [RN Paper Icons](https://materialdesignicons.com/)
 - [RN Paper Theming](https://callstack.github.io/react-native-paper/theming.html)
 - [RN Paper FAB](https://callstack.github.io/react-native-paper/animated-fab.html)
 - [RN Paper Bottom Navigation](https://callstack.github.io/react-native-paper/bottom-navigation.html)
 - [RN Paper Custom font](https://callstack.github.io/react-native-paper/fonts.html)

## Socket idea:  
 - [x] **(CURRENT)** Use `rooms` to make private chat
 - **Password keystone**: 1234567
 - Build APK: assembleRelease
 - Kill process at port: `sudo kill -9 $(sudo lsof -t -i:${PORT})`
