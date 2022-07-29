import React from "react";
import { View, Text, Image } from "react-native";
import {Avatar, Button, withTheme} from "react-native-paper";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { GetComments } from "../ReduxSaga/Comments/ActionFunctions";
import { WebView } from "react-native-webview";
import AutoHeightWebView from "react-native-autoheight-webview";
import {FlatGrid} from "react-native-super-grid";
import {DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import moment from "moment";

const NewsWrapper = styled(View)`
    padding         : 15px;
    background-color: #fff;
    margin: 5px 15px;
    border-radius: 20px;
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
    color       : ${props => props.theme.text};
    font-family : "NunitoBold";
    font-size   : 16px;
`;

const NewsContent = styled(Text)`
    color       : white;
    font-family : "NunitoRegular";
    font-size   : 14px;
    margin-top  : 12px;
`;

const NewsMedia = styled(View)`
    margin-top: 8px;
`;

const PostTimestamp = styled(Text)`
    font-size   : 10px;
    font-style  : italic;
    color: ${props => props.theme.secondaryTextColor};
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
    const { colors } = props.theme;

    const LoadComments = function(postId) {
        // dispatch(GetComments(postId));
        showComment(true);
    }

    const GenContent = function(content) {
        return `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${content}</body></html>`
    }

    return(
        <NewsWrapper elevation={8}>
            <NewsHeader theme={colors}>
                <AvatarWrapper theme={colors}>
                    {
                        data.avatar === ""
                            ? <Avatar.Text size={40} label="DM" style={{marginRight: 10}}/>
                            : <Image source={{uri: DEFAULT_BASE_URL + data.avatar}} style={{width: 40, height: 40, borderRadius: 9999, marginRight: 10}}/>
                    }
                    {/*<ActiveStatusDot active={false}/>*/}
                </AvatarWrapper>
                <View>
                    <NewsUsername theme={colors}>{data.display_name}</NewsUsername>
                    {
                        moment.duration(moment().diff(moment(data.created_at))).asHours() < 24
                            ? <PostTimestamp theme={colors}>Posted {Math.round(moment.duration(moment().diff(moment(data.created_at))).asHours())} ago</PostTimestamp>
                            : <PostTimestamp theme={colors}>Posted at {moment(data.created_at).format("MMM DD hh:mm A")}</PostTimestamp>
                    }
                </View>
            </NewsHeader>

            <NewsMedia>
                {data.media.length > 0 &&
                    data.media.map((image, index) => {
                        return(
                            <Image
                                key={"_post_" + index}
                                source={{uri: DEFAULT_BASE_URL + image}}
                                style={{
                                    height: 300,
                                    flex: 1,
                                    width: null,
                                    resizeMode: "contain",
                                    borderRadius: 10
                                }}
                            />
                        )
                    })
                    // <NewsMedia>
                    //     <FlatGrid
                    //         spacing={10}
                    //         data={data.media}
                    //         itemDimension={150}
                    //         renderItem={item => (<Image source={{uri: DEFAULT_BASE_URL + item}} style={{width: (width-10)/2, height: 150, resizeMode: "contain"}}/>)}
                    //     />
                    // </NewsMedia>
                }
            </NewsMedia>

            <AutoHeightWebView
                style={{
                    marginTop: 5
                }}
                source={{html: GenContent(data.content)}}
            />

            <NewsInteractive>
                <ReactionButton onPress={e => console.log("Like")} onLongPress={e => console.log("Hold to choose")} uppercase={false} icon='thumb-up'>Like</ReactionButton>
                <CommentButton onPress={_ => LoadComments(1)} uppercase={false} icon='message-reply'>Comment</CommentButton>
            </NewsInteractive>
        </NewsWrapper>
    );
}

export default withTheme(SingleNews);