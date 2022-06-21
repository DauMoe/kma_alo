/**
 * @format
 */

import React from 'react';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FontConfig from './components/CustomFont';


const theme = {
    ...DefaultTheme,
    roundness   : 2,
    version     : 3,
    colors: {
        ...DefaultTheme.colors,
        primary   : '#FF8585',
        secondary : '#f1c40f',
        tertiary  : '#a1b2c3'
    },
    fonts: configureFonts(FontConfig)
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App/>
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
