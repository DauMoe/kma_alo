import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import LoginScreen from './components/LoginScreen/index';
import MainScreen from './components/MainScreen/index';

const Stack = createNativeStackNavigator();

const App = function(props) {
  return(
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
      />
    </Stack.Navigator>
  );
}

export default App;