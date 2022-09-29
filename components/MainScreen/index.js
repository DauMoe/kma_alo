import React, { useEffect, useState } from "react";
import {BottomNavigation} from 'react-native-paper';
import NewsFeedScreen from '../NewsFeedScreen/index';
import FriendsScreen from '../FriendsScreen';
import ListChatsScreen from '../ChatScreen/ListChatsScreen';
import UserProfileScreen from '../UserProfileScreen';
import { useSelector } from "react-redux";
import Chats from "../ReduxSaga/Chat/Reducers";

const MainScreen = function (props) {
  const [CurrentTab, setTab] = useState(0);
  const { unread_count } = useSelector(state => state.Chats);
  const [routes, setRoutes] = useState([
    {key: 'news_feed', title: 'Feed', icon: 'newspaper-variant'},
    {key: 'friends', title: 'Friends', icon: 'account-box-multiple'},
    {key: 'chat', title: 'Chat', icon: 'chat', badge: unread_count},
    {key: 'profile', title: 'Profile', icon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    news_feed: NewsFeedScreen,
    friends: FriendsScreen,
    chat: ListChatsScreen,
    profile: UserProfileScreen,
  });

  useEffect(() => {
    const Clone = routes;
    const newItem = {key: 'chat', title: 'Chat', icon: 'chat', badge: unread_count};
    Clone.splice(2, 1, newItem);
    setRoutes(Clone);
  }, [unread_count]);

  return (
    <BottomNavigation
      navigationState={{index: CurrentTab, routes: routes}}
      onIndexChange={setTab}
      renderScene={renderScene}
    />
  );
};

export default MainScreen;
