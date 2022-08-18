import React, {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import NewsFeedScreen from '../NewsFeedScreen/index';
import FriendsScreen from '../FriendsScreen';
import ListChatsScreen from '../ChatScreen/ListChatsScreen';
import UserProfileScreen from '../UserProfileScreen';

const MainScreen = function (props) {
  const [CurrentTab, setTab] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'news_feed', title: 'Feed', icon: 'newspaper-variant'},
    {key: 'friends', title: 'Friends', icon: 'newspaper-variant'},
    {key: 'chat', title: 'Chat', icon: 'chat'},
    {key: 'profile', title: 'Profile', icon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    news_feed: NewsFeedScreen,
    friends: FriendsScreen,
    chat: ListChatsScreen,
    profile: UserProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{index: CurrentTab, routes: routes}}
      onIndexChange={setTab}
      renderScene={renderScene}
    />
  );
};

export default MainScreen;
