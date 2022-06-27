import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import SwipeUpDown from "react-native-swipe-up-down";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const Comments = function() {
    return(
        <View></View>
    );
}

const CommentsScreen = function(props) {
    const { navigation, show } = props;
    const { width, height } = Dimensions.get("screen");
    const { loaded, err, error_msg, data } = useSelector(state => state.Comments);
    const swipeUpDownRef = useRef();
    useEffect(function() {
        if (show) swipeUpDownRef.current.showFull();
    });
    return(
        <SwipeUpDown
            itemFull={<Comments/>}
            swipeHeight={height}
            ref={swipeUpDownRef}
            extraMarginTop={0}
            disableSwipeIcon
            animation="easeInEaseOut"
            style={{backgroundColor: "#ABABAB"}}
        />
    );
}

export default CommentsScreen;