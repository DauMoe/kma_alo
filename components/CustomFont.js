import { DefaultTheme } from "react-native-paper";

const FontConfig = {
    ...DefaultTheme.fonts,
    android: {
        regular: {
            fontFamily: 'NunitoMedium',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'NunitoBold',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'NunitoLight',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'NunitoRegular',
            fontWeight: 'normal',
        }
    }
}

export default FontConfig;