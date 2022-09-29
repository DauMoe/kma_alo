import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from './components/LoginScreen/index';
import MainScreen from './components/MainScreen/index';
import {
  CHANGE_PASS_SCREEN,
  CHAT_SCREEN, CREATE_ACCOUNT_SCREEN, CREATE_POST_SCREEN, EDIT_USER_PROFILE_SCREEN,
  FORGET_PASSWORD_SCREEN, FRIENDS_SCREEN,
  LIST_CHATS_SCREEN,
  LOADING_SCREEN,
  LOGIN_SCREEN,
  MAIN_SCREEN, PROFILE_SCREEN, USER_PROFILE_SCREEN, VIDEO_CALL_SCREEN,
} from "./components/Definition";
import SetIPModal from "./components/SetIPModal";
import ForgetPasswordScreen from "./components/ForgetPasswordScreen";
import ChatScreen from "./components/ChatScreen";
import ListChatsScreen from "./components/ChatScreen/ListChatsScreen";
import FriendsScreen from "./components/FriendsScreen";
import UserProfileScreen from "./components/UserProfileScreen";
import {StatusBar} from "react-native";
import EditProfileScreen from "./components/UserProfileScreen/EditProfileScreen";
import CreateAccountScreen from "./components/CreateAccountScreen";
import CreatePostScreen from "./components/NewsFeedScreen/CreatePostScreen";
import VideoCallScreen from "./components/VideoCallScreen";
import ProfileScreen from "./components/ProfileScreen";
import io from "socket.io-client";
import { DEFAULT_BASE_URL } from "./components/ReduxSaga/AxiosConfig";
import { useSelector } from "react-redux";
import ChangePassword from "./components/UserProfileScreen/ChangePassword";

const Stack = createNativeStackNavigator();

const App = function(props) {
  const { token } = useSelector(state => state.Authenticator);
  useEffect(() => {
    const newSocket = io(`${DEFAULT_BASE_URL}/notification`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return(() => {
      newSocket.close();
    });
  }, []);

  return(
    <>
        <StatusBar
            animated
            hidden={false}
            barStyle={"light-content"}
            backgroundColor="#61dafb"
        />
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={LOADING_SCREEN}>
            <Stack.Screen
                name={CREATE_POST_SCREEN}
                component={CreatePostScreen}
                options={{
                    animation: "none"
                }}
            />
            <Stack.Screen
                name={LOADING_SCREEN}
                component={LoadingScreen}

            />
            <Stack.Screen
                name={LOGIN_SCREEN}
                component={LoginScreen}
            />
            <Stack.Screen
                name={FORGET_PASSWORD_SCREEN}
                component={ForgetPasswordScreen}
            />
            <Stack.Screen
                name={MAIN_SCREEN}
                component={MainScreen}
            />
            <Stack.Screen
                name={CHAT_SCREEN}
                component={ChatScreen}
            />
            <Stack.Screen
                name={LIST_CHATS_SCREEN}
                component={ListChatsScreen}
            />
            <Stack.Screen
                name={FRIENDS_SCREEN}
                component={FriendsScreen}
            />
            <Stack.Screen
                name={USER_PROFILE_SCREEN}
                component={UserProfileScreen}
            />
            <Stack.Screen
                name={EDIT_USER_PROFILE_SCREEN}
                component={EditProfileScreen}
                options={{
                    animation: "none"
                }}
            />
            <Stack.Screen
                name={CREATE_ACCOUNT_SCREEN}
                component={CreateAccountScreen}
                options={{
                    animation: "none"
                }}
            />
            <Stack.Screen
                name={PROFILE_SCREEN}
                component={ProfileScreen}
                options={{
                    animation: "none"
                }}
            />
          <Stack.Screen
            name={VIDEO_CALL_SCREEN}
            component={VideoCallScreen}
          />
          <Stack.Screen
            name={CHANGE_PASS_SCREEN}
            component={ChangePassword}
          />
      </Stack.Navigator>
      {/*<SetIPModal/>*/}
    </>
  );
}

export default App;
