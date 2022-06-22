import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import CommentsScreen from "../CommentsScreen";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';

const NewsFeedWrapper = styled(View)`
    height: ${props => props.height + "px"};
    position: relative;
`;

const NewsFeedScreen = function(props) {
    const { width, height } = Dimensions.get("window");
    return(
        <NewsFeedWrapper height={height}>
            <ScrollView>
                <SingleNews/>
                <SingleNews/>
                <SingleNews/>
                <SingleNews/>
                <SingleNews/>
            </ScrollView>
            <CommentsScreen OpenCommentScreen={true}/>
        </NewsFeedWrapper>
    );
}

export default NewsFeedScreen;