import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import { Avatar } from "react-native-paper";
import SwipeUpDown from "react-native-swipe-up-down";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import {useNavigation} from "@react-navigation/native";

const CommentsWrapper = styled(View)`
    padding: 20px;
`;

const CommentWrapper = styled(View)`
    display: flex;
    flex-direction: row;
`;

const AvatarWrapper = styled(View)`

`;

const ContentWrapper = styled(View)`
    border-radius: 15px;
    background-color: #5D5D5D;

`;


const Comments = function() {
    return(
        <CommentsWrapper>

            <CommentWrapper>
                <AvatarWrapper>
                    <Avatar.Text size={50} label="AB" style={{marginRight: 10}}/>
                </AvatarWrapper>
                <ContentWrapper>
                    <Text>ffffffffff</Text>
                </ContentWrapper>
            </CommentWrapper>

        </CommentsWrapper>
    );
}

const CommentsScreen = function(props) {
    const { show } = props;
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