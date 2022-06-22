import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from './components/LoginScreen/index';
import MainScreen from './components/MainScreen/index';
import { LOADING_SCREEN, LOGIN_SCREEN, MAIN_SCREEN } from "./components/ScreenName";

const Stack = createNativeStackNavigator();

const App = function(props) {
  return(
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
  );
}

export default App;