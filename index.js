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
import {axiosConfig} from "./components/ReduxSaga/AxiosConfig";
import {GET_CHAT_HISTORY} from "./components/API_Definition";
import { SWRConfig } from "swr";


const theme = {
    ...DefaultTheme,
    roundness   : 2,
    version     : 3,
    colors: {
        ...DefaultTheme.colors,
        primary   : '#58B7E9',
        accent : '#c74e4e',
        negativeTextColor: '#FFF',
        acceptRequestColor: '#0cc99e',
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
                    <SWRConfig
                      value={{
                        provider:() => new Map(),
                        isOnline() {
                          return true
                        },
                        refreshInterval: 0,
                        fetcher: (url, method, options) => axiosConfig(url, method, options).then(r => r)
                      }}>
                        <App/>
                    </SWRConfig>
                </NavigationContainer>
            </PaperProvider>
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
