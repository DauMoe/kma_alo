/**
 * @format
 */

import React from 'react';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from "react-redux";
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FontConfig from './components/CustomFont';
import store from './components/ReduxSaga/RootReducer';
import { NavigationContainer } from '@react-navigation/native';


const theme = {
    ...DefaultTheme,
    roundness   : 2,
    version     : 3,
    colors: {
        ...DefaultTheme.colors,
        primary   : '#58B7E9',
        accent : '#c74e4e',
        negativeTextColor: '#FFF',
        negativeBgColor: '#a9a9a9',
        positiveTextColor: '#FFF',
        positiveBgColor: '#1ea5e1',
        text: '#343333',
        secondaryTextColor: '#8d8d8d'
    },
    fonts: configureFonts(FontConfig)
};

export default function Main() {
    return (
        <StoreProvider store={store}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <App/>
                </NavigationContainer>
            </PaperProvider>
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
