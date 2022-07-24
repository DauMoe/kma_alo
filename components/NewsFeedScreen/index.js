import React, { useState } from "react";
import {View, ScrollView, Dimensions, Text} from "react-native";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';
import CommentsScreen from "./CommentScreen";
import {useNavigation} from "@react-navigation/native";

const NewsFeedWrapper = styled(View)`
    height: ${props => props.height + "px"};
    position: relative;
`;

const CreatePostWrapper = styled(View)`
  padding: 20px 30px;
  background-color: white;
  margin-top: 5px;
  border-radius: 5px;
`;

const NewsFeedScreen = function(props) {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get("window");
    const [openComment, setOpen] = useState(false);

    const openCommentScreen = function(show) {
        setOpen(show);
    }

    const Go2CreatePost = function() {

    }


    return(
        <NewsFeedWrapper height={height}>
            <ScrollView style={{backgroundColor: "black"}}>
                <CreatePostWrapper onPress={Go2CreatePost}>
                    <Text>How about you today?</Text>
                </CreatePostWrapper>
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