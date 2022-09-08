import React, {useEffect, useRef, useState} from "react";
import {View, Text, Dimensions, FlatList, Image} from "react-native";
import {Avatar, withTheme} from "react-native-paper";
import SwipeUpDown from "react-native-swipe-up-down";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import {useNavigation, useRoute} from "@react-navigation/native";
import SingleNews from "./SingleNews";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GET_COMMENTS} from "../API_Definition";
import moment from "moment";

const CommentWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const AvatarWrapper = styled(View)`

`;

const ContentWrapper = styled(View)`
  padding: 3px 0;
    //background-color: #5D5D5D;
`;

const CommentSection = styled(View)`
  padding: 20px;
`;

const CommentUsername = styled(Text)`
  font-size: 15px;
  font-family: "NunitoBold";
  color: black;
`;

const PostTimestamp = styled(Text)`
  font-size   : 10px;
  font-family: "NunitoSemiBold";
  color: ${props => props.theme.secondaryTextColor};
`;

const CommentContent = styled(Text)`
  font-size   : 20px;
  margin-top: 5px;
  font-family: "NunitoRegular";
  color: ${props => props.theme.secondaryTextColor};
`;

const CommentsScreen = function(props) {
    const { show, showComment, post_id } = props;
    const { width, height } = Dimensions.get("screen");
    const { colors } = props.theme;
    const { loaded, err, error_msg, data } = useSelector(state => state.Comments);
    const [listComments, setComments] = useState([]);
    const swipeUpDownRef = useRef();

    const FetchComments = function() {
        const controller = new AbortController();
        const fetch = axiosConfig(GET_COMMENTS, "get", {
            params: {
                post_id: post_id
            }
        })
            .then(r => {
                setComments(r.data.data);
            })
            .catch(e => console.error(e.response));
        return { controller, fetch };
    }

    const CommentItem = function(props) {
        const { data } = props;
        return(
            <CommentWrapper>
                <AvatarWrapper>
                    {
                        data.avatar !== ""
                            ? <Avatar.Text size={50} label={data.avatar_text} style={{marginRight: 10}}/>
                            : <Image source={{uri: DEFAULT_BASE_URL + data.avatar}} style={{width: 50, height: 50}}/>
                    }
                </AvatarWrapper>
                <ContentWrapper>
                    <CommentUsername>{data.display_name}</CommentUsername>
                    {
                        moment.duration(moment().diff(moment(data.created_at))).asMinutes() < 1
                            ? <PostTimestamp>Just now</PostTimestamp>
                            :moment.duration(moment().diff(moment(data.created_at))).asHours() < 1
                                ? <PostTimestamp theme={colors}>{Math.round(moment.duration(moment().diff(moment(data.created_at))).asMinutes())}m ago</PostTimestamp>
                                : moment.duration(moment().diff(moment(data.created_at))).asHours() < 24
                                    ? <PostTimestamp theme={colors}>{Math.round(moment.duration(moment().diff(moment(data.created_at))).asHours())}h ago</PostTimestamp>
                                    : <PostTimestamp theme={colors}>{moment(data.created_at).format("MMM DD hh:mm A")}</PostTimestamp>
                    }
                    <CommentContent theme={colors}>{data.content}</CommentContent>
                </ContentWrapper>
            </CommentWrapper>
        );
    }

    const Comments = function() {
        return (
            <CommentSection>
                <Text style={{fontSize: 25, fontFamily: "NunitoSemiBold", color: "black"}}>Comments ({listComments.length})</Text>
                <FlatList
                    data={listComments}
                    disableVirtualization={false}
                    keyExtractor={(item, index) => "_comments_" + index}
                    ListEmptyComponent={<View style={{marginTop: 30, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: colors.text, fontFamily: "NunitoSemiBold"}}>No comments</Text></View>}
                    renderItem={({ item, index }) => {
                        return <CommentItem data={item}/>
                    }}
                    style={{marginTop: 20}}
                />
            </CommentSection>
        )
    }

    useEffect(function() {
        if(show) {
            swipeUpDownRef.current.showFull();
        }
    });

    useEffect(function() {
        const p1 = FetchComments();
        return(() => {
            p1.controller.abort();
        })
    }, [])

    return(
        <SwipeUpDown
            itemFull={<Comments/>}
            swipeHeight={height}
            ref={swipeUpDownRef}
            extraMarginTop={10}
            disableSwipeIcon
            onShowMini={() => showComment(false)}
            animation="easeInEaseOut"
            style={{backgroundColor: "#FFF", zIndex: 10}}
        />
    );
}

export default withTheme(CommentsScreen);