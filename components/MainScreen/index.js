import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import LoginScreen from "../LoginScreen";
import NewsFeedScreen from '../NewsFeedScreen/index';
import LoadingScreen from '../LoadingScreen/index';

const MainScreen = function(props) {
    const { navigation }        = props;
    const [CurrentTab, setTab]  = useState(0);
    const [routes, setRoutes]   = useState([
      {key: "news_feed", title: "Feed", focusedIcon: 'newspaper-variant', unfocusedIcon: 'newspaper-variant-outline'},
      {key: "friends", title: "Friends", focusedIcon: 'newspaper-variant', unfocusedIcon: 'newspaper-variant-outline'},
      {key: "chat", title: "Chat", focusedIcon: 'heart', unfocusedIcon: 'emessage-reply'},
      {key: "profile", title: "Profile", focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    ]);
  
    const renderScene = BottomNavigation.SceneMap({
      news_feed: NewsFeedScreen,
      friends: LoginScreen,
      chat: LoginScreen,
      profile: LoadingScreen
    });
  
    return(
      <BottomNavigation
        shifting={true}
        navigationState={{ index: CurrentTab, routes: routes }}
        onIndexChange={setTab}
        renderScene={renderScene}
      />
    );
}

export default MainScreen;