import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from './components/LoginScreen/index';
import MainScreen from './components/MainScreen/index';
import { FAB } from "react-native-paper";
import { LOADING_SCREEN, LOGIN_SCREEN, MAIN_SCREEN } from "./components/ScreenName";
import styled from 'styled-components/native';

const Stack = createNativeStackNavigator();

const SetIPButton = styled(FAB)`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: white;
`;

const App = function(props) {
  const ChangeBaseUrl = function() {
    console.log("Change base url");
  };

  return(
    <>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={LOADING_SCREEN}>
          <Stack.Screen
            name={LOADING_SCREEN}
            component={LoadingScreen}
          />
          <Stack.Screen
            name={LOGIN_SCREEN}
            component={LoginScreen}
          />
          <Stack.Screen
            name={MAIN_SCREEN}
            component={MainScreen}
          />
      </Stack.Navigator>
      <SetIPButton small color="gray" icon="server" onPress={ChangeBaseUrl}/>
    </>
  );
}

export default App;