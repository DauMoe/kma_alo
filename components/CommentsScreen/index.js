import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import SwipeUpDown from "react-native-swipe-up-down";
import styled from "styled-components/native";

const CommentsWrapper = styled(View)`
    height: ${props => props.height + "px"};
    width: ${props => props.width + "px"};
    background-color: gray;
    position: absolute;
    bottom: 0;
    z-index: 10;
`;

const HandleSwipeDown = function() {
    console.log("Down");
}

const Comments = function() {
    return(
        <View><Text>fff</Text></View>
    )
};

const CommentsScreen = function(props) {
    const { OpenCommentScreen } = props;
    const { width, height } = Dimensions.get("screen");
    const swipeUpDownRef = useRef();
    useEffect(function() {
        if (OpenCommentScreen) swipeUpDownRef.current.showFull();
    }, []);
    return(
        <SwipeUpDown
            itemFull={<Comments />}
            swipeHeight={height}
            ref={swipeUpDownRef}
            extraMarginTop={0}
            disableSwipeIcon
            style={{backgroundColor: "green"}}
        />
    );
}

export default CommentsScreen;