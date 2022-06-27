import React, { useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';
import CommentsScreen from "./CommentScreen";

const NewsFeedWrapper = styled(View)`
    height: ${props => props.height + "px"};
    position: relative;
`;

const NewsFeedScreen = function(props) {
    const { width, height } = Dimensions.get("window");
    const [openComment, setOpen] = useState(false);

    const openCommentScreen = function(show) {
        setOpen(show);
    }

    return(
        <NewsFeedWrapper height={height}>
            <ScrollView style={{backgroundColor: "black"}}>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
                <SingleNews showComment={openCommentScreen}/>
            </ScrollView>
            <CommentsScreen show={openComment}/>
        </NewsFeedWrapper>
    );
}

export default NewsFeedScreen;