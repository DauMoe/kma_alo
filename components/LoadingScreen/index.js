import React from "react";
import { Dimensions, View, Text } from "react-native";
import styled from "styled-components/native";
import LogoSvg from "./../Media/logo.svg";

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
    const { width, height } = Dimensions.get("window");

    return (
        <LoadingScreenWrapper height={height}>
            <LogoSvg width={width*0.6}/>
            <LoadingScreenDescription>A production of Dinh The Anh</LoadingScreenDescription>
        </LoadingScreenWrapper>
    );
}

export default LoadingScreen;