import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";
import NewsFeedScreen from "./components/NewsFeedScreen";

const App = function(props) {
  const [CurrentTab, setTab]  = useState(0);
  const [routes, setRoutes]   = useState([
    {key: "news_feed", title: "Feed", focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    {key: "chat", title: "Chat", focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    {key: "profile", title: "Profile", focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    news_feed: NewsFeedScreen,
    chat: LoginScreen,
    profile: LoadingScreen
  });

  return(
    // <LoadingScreen/>
    // <LoginScreen/>
    // <NewsFeedScreen/>
    <BottomNavigation
      shifting={true}
      navigationState={{ index: CurrentTab, routes: routes }}
      onIndexChange={setTab}
      renderScene={renderScene}
    />
  );
}

export default App;