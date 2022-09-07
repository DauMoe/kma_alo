import React, {useState} from "react";
import { View, Text, Image } from "react-native";
import {Avatar, Button, IconButton, Modal, Portal, Provider, withTheme} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components/native";
import AutoHeightWebView from "react-native-autoheight-webview";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import moment from "moment";
import jwt_decode from "jwt-decode";
import {REACT_POST} from "../API_Definition";

const NewsWrapper = styled(View)`
    padding: 20px;
    background-color: #fff;
    margin: 8px 18px;
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
    const { width, height, showComment, data, ConfirmDeletePost, openDeleteModal, reactionPost }  = props;
    const { colors }                            = props.theme;
    const dispatch                              = useDispatch();
    const { token }                             = useSelector(state => state.Authenticator);
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIxLCJlbWFpbCI6ImxlaHV5aG9hbmcxMTExOTk5QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZGF1bW9lMSIsImlhdCI6MTY2MDgzNTg3NCwiZXhwIjoxODc2ODM1ODc0fQ.E-whu03YrSH9KOrqxBIP5aoL6bkDxNX6mvv7qe9yeJM";
    const { uid, email, username }              = jwt_decode(token);

    const LoadComments = function(postId) {
        // dispatch(GetComments(postId));
        showComment(true);
    }

    const GenContent = function(content) {
        return `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${content}</body></html>`
    }

    const LikePost = function (post_id, type) {
        axiosConfig(REACT_POST, "post", {
            data: {
                post_id, type
            }
        })
            .then(r => {

            })
            .catch(e => console.log(e));
    }

    return(
        <NewsWrapper elevation={8}>
            <NewsHeader theme={colors}>
                <AvatarWrapper theme={colors}>
                    {
                        data.avatar === ""
                            ? <Avatar.Text size={40} label={data.avatar_text} style={{marginRight: 10}}/>
                            : <Image source={{uri: DEFAULT_BASE_URL + data.avatar}} style={{width: 40, height: 40, borderRadius: 9999, marginRight: 10}}/>
                    }
                    {/*<ActiveStatusDot active={false}/>*/}
                </AvatarWrapper>
                <View style={{flex: 1}}>
                    <NewsUsername theme={colors}>{data.display_name}</NewsUsername>
                    {
                        moment.duration(moment().diff(moment(data.created_at))).asMinutes() < 1
                          ? <PostTimestamp>Just now</PostTimestamp>
                            :moment.duration(moment().diff(moment(data.created_at))).asHours() < 1
                          ? <PostTimestamp theme={colors}>Posted {Math.round(moment.duration(moment().diff(moment(data.created_at))).asMinutes())}m ago</PostTimestamp>
                            : moment.duration(moment().diff(moment(data.created_at))).asHours() < 24
                          ? <PostTimestamp theme={colors}>Posted {Math.round(moment.duration(moment().diff(moment(data.created_at))).asHours())}h ago</PostTimestamp>
                            : <PostTimestamp theme={colors}>Posted at {moment(data.created_at).format("MMM DD hh:mm A")}</PostTimestamp>
                    }
                </View>
                {
                    data.author_id === uid &&
                    <View>
                        <IconButton
                            icon="delete-empty"
                            color={"#9d0b96"}
                            size={22}
                            onPress={() => openDeleteModal(true, data.post_id)}
                        />
                    </View>
                }
            </NewsHeader>

            <NewsMedia>
                {data.media.length > 0 &&
                    data.media.map((image, index) => {
                        return(
                            <Image
                                key={"_post_" + index}
                                source={{uri: DEFAULT_BASE_URL + image}}
                                style={{
                                    width: '100%',
                                    height: undefined,
                                    aspectRatio: 1,
                                    borderRadius: 10,
                                    marginBottom: index < data.media.length-1 ? 8 : 0
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
                customStyle={`
                  * {
                    color: black
                  }
                `}
                source={{html: GenContent(data.title ? `<h3 style="margin-bottom: 2px">${data.title}</h3>${data.content}` : data.content)}}
            />

            <NewsInteractive>
                <ReactionButton onPress={() => reactionPost(data.post_id, 3)} onLongPress={e => console.log("Hold to choose")} uppercase={false} icon='thumb-up'>{data.reactions.length} {data.reactions.length < 2 ? "like" : "likes"}</ReactionButton>
                {/*<CommentButton onPress={_ => LoadComments(1)} uppercase={false} icon='message-reply'>0 comment</CommentButton>*/}
                <CommentButton onPress={_ => console.log("comment")} uppercase={false} icon='message-reply'>0 comment</CommentButton>
            </NewsInteractive>
        </NewsWrapper>
    );
}

export default withTheme(SingleNews);
