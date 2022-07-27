import React from "react";
import { View, Text, Image } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { GetComments } from "../ReduxSaga/Comments/ActionFunctions";
import { WebView } from "react-native-webview";
import AutoHeightWebView from "react-native-autoheight-webview";

const NewsWrapper = styled(View)`
    padding         : 10px;
    background-color: #646464;
    margin-top      : 10px;
`;

const NewsHeader = styled(View)`
    display         : flex;
    align-items     : center;
    flex-direction  : row;
`;

const AvatarWrapper = styled(View)`
    position: relative;
`;

const ActiveStatusDot = styled(View)`
    position            : absolute;
    width               : 10px;
    height              : 10px;
    border-radius       : 50px;
    right               : 12px;
    bottom              : 0;
    z-index             : 2;
    background-color    : ${props => props.active ? '#06D3C2' : '#F58F06'};
    border              : solid 1px #EFEFEF;
`;

const NewsUsername = styled(Text)`
    color       : white;
    font-family : "NunitoBold";
    font-size   : 18px;
`;

const NewsContent = styled(Text)`
    color       : white;
    font-family : "NunitoRegular";
    font-size   : 14px;
    margin-top  : 12px;
`;

const NewsMedia = styled(View)`
    background-color: aliceblue;
    margin-top: 8px;
`;

const PostTimestamp = styled(Text)`
    font-size   : 10px;
    font-style  : italic;
`;

const NewsInteractive = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`;

const ReactionButton = styled(Button)`
    flex: 1;
    background-color: white;
    margin-right: 5px;
    border-radius: 5px;
`;

const CommentButton = styled(Button)`
    flex: 1;
    background-color: white;
    margin-left: 5px;
    border-radius: 5px;
`; 

const SingleNews = function(props) {
    const { width, height, showComment, data } = props;
    const dispatch          = useDispatch();

    const LoadComments = function(postId) {
        dispatch(GetComments(postId));
        showComment(true);
    }

    const GenContent = function(content) {
        return `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${content}</body></html>`
    }

    return(
        <NewsWrapper>
            <NewsHeader>
                <AvatarWrapper>
                    <Avatar.Text size={50} label="DM" style={{marginRight: 10}}/>
                    <ActiveStatusDot active={false}/>
                </AvatarWrapper>
                <View>
                    <NewsUsername>Daumoe</NewsUsername>
                    {/* <PostTimestamp>Jun 17 at 9:09 PM</PostTimestamp> */}
                    <PostTimestamp>Posted 3h ago</PostTimestamp>
                </View>
            </NewsHeader>

            <AutoHeightWebView
                style={{
                    marginTop: 5
                }}
                source={{html: GenContent(data.content)}}
            />

            <NewsMedia>
                <Image style={{resizeMode: "contain", width: "100%", height: 100}} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png'}}/>
            </NewsMedia>

            <NewsInteractive>
                <ReactionButton onPress={e => console.log("Like")} onLongPress={e => console.log("Hold to choose")} uppercase={false} icon='thumb-up'>Like</ReactionButton>
                <CommentButton onPress={_ => LoadComments(1)} uppercase={false} icon='message-reply'>Comment</CommentButton>
            </NewsInteractive>
        </NewsWrapper>
    );
}

export default SingleNews;