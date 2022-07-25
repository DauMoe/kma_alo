import React, { useState } from "react";
import {View, ScrollView, Dimensions, Text, TouchableOpacity} from "react-native";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';
import CommentsScreen from "./CommentScreen";
import {useNavigation} from "@react-navigation/native";
import {CREATE_POST_SCREEN} from "../Definition";
import {FAB, withTheme} from "react-native-paper";

const NewsFeedWrapper = styled(View)`
    height: ${props => props.height + "px"};
    position: relative;
`;

const CreatePostWrapper = styled(TouchableOpacity)`
  padding: 20px 30px;
  background-color: white;
  margin-top: 5px;
  border-radius: 5px;
`;

const NewsFeedScreen = function(props) {
    const { colors } = props.theme;
    const navigation = useNavigation();
    const { width, height } = Dimensions.get("window");
    const [openComment, setOpen] = useState(false);

    const openCommentScreen = function(show) {
        setOpen(show);
    }

    const Go2CreatePost = function() {
        navigation.navigate(CREATE_POST_SCREEN);
    }


    return(
        <NewsFeedWrapper height={height}>
            <FAB
                small
                icon="plus"
                onPress={Go2CreatePost}
                style={{
                    zIndex: 9,
                    position: "absolute",
                    bottom: 70, right: 20
                }}
            />
            <ScrollView>
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

export default withTheme(NewsFeedScreen);