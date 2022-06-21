/**
 * @format
 */

import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


const theme = {
    ...DefaultTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      secondary: '#f1c40f',
      tertiary: '#a1b2c3'
    },
    fonts: {
        ...DefaultTheme.fonts,
        medium: {fontFamily: 'NunitoBold'},
        regular:{fontFamily: 'NunitoMedium'},
        light:{fontFamily: 'NunitoRegular'},
        thin:{fontFamily: 'NunitoLight'}
    }
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App/>
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
