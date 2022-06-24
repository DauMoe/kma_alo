import React, { useEffect } from "react";
import { Dimensions, View, Text } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import LogoSvg from "./../Media/logo.svg";
import { axiosConfig } from '../ReduxSaga/AxiosConfig';
import { LOGIN_SCREEN } from '../ScreenName';

const LoadingScreenWrapper = styled.View`
    height          : ${props => props.height + "px"};
    background-color: #2A719D;
    display         : flex;
    align-items     : center;
    justify-content : center;
    position        : relative;
`;

const LoadingScreenDescription = styled.Text`
    position    : absolute;
    bottom      : 10px;
    font-style  : italic;
`;

const LoadingScreen = function(props) {
    const { navigation }    = props;
    const { width, height } = Dimensions.get("window");
    const authenticator     = useSelector(state => state.Authenticator);

    useEffect(function() {
        if (authenticator.token) {
            axiosConfig("/check_valid_token", "get", undefined);
        } else {
            navigation.navigate(LOGIN_SCREEN);
        }
        /**
         * @todo:
         *  - Get all chat => compare with local DB and see if last timestamp is proximate => (YES) not update || (NO) get all again
         */
    });

    return (
        <LoadingScreenWrapper height={height}>
            <LogoSvg width={width*0.6}/>
            <LoadingScreenDescription>A production of Dinh The Anh</LoadingScreenDescription>
        </LoadingScreenWrapper>
    );
}

export default LoadingScreen;