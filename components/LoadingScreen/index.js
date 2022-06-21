import React from "react";
import { Dimensions, View, Text } from "react-native";
import styled from "styled-components/native";
import LogoSvg from "./../Media/logo.svg";

const LoadingScreenWrapper = styled.View`
    height: ${props => props.height + "px"};
    background-color: white;
`;

const LoadingScreen = function(props) {
    const { width, height } = Dimensions.get("window");

    return (
        <LoadingScreenWrapper height={height}>
            <LogoSvg width={200} height={200}/>
        </LoadingScreenWrapper>
    );
}

export default LoadingScreen;