import React, { useEffect, useRef } from "react";
import { Dimensions, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import LogoSvg from "./../Media/logo.svg";
import { axiosConfig } from '../ReduxSaga/AxiosConfig';
import { HOST_TABLE, LOGIN_SCREEN, MAIN_SCREEN } from '../Definition';
import { _db } from "../Utils";
import { CheckAllLocalData } from "../ReduxSaga/Authenticator/Actions";

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
    const dispatch          = useDispatch();

    useEffect(function() {
        if (authenticator.first_check) {
            dispatch(CheckAllLocalData());
            console.log("FIRST CHECK");
        } else {
            if (authenticator.token) {
                console.log("HAVING TOKEN");
                //Check valid => (YES) Navigate to MAIN SCREEN => (NO) Navigate to LOGIN SCREEN
                navigation.navigate(MAIN_SCREEN);
            } else {
                console.log("NO TOKEN");
                navigation.navigate(LOGIN_SCREEN);
            }
        }
    }, [authenticator.first_check]);

    return (
        <LoadingScreenWrapper height={height}>
            <LogoSvg width={width*0.6}/>
            <LoadingScreenDescription>A production of Dinh The Anh</LoadingScreenDescription>
        </LoadingScreenWrapper>
    );
}

export default LoadingScreen;
