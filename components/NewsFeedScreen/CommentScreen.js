import React, {useEffect, useRef, useState} from "react";
import { View, Text, Dimensions, FlatList, Image, TextInput, KeyboardAvoidingView } from "react-native";
import { Avatar, IconButton, withTheme } from "react-native-paper";
import SwipeUpDown from "react-native-swipe-up-down";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import {useNavigation, useRoute} from "@react-navigation/native";
import SingleNews from "./SingleNews";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import { GET_COMMENTS, NEW_COMMENTS } from "../API_Definition";
import moment from "moment";

const CommentWrapper = styled(KeyboardAvoidingView)`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  background-color: #eeeeee;
  padding: 10px;
  border-radius: 10px;
`;

const AvatarWrapper = styled(View)`

`;

const ContentWrapper = styled(View)`
  padding: 3px 0;
`;

const CommentSection = styled(View)`
  padding: 20px;
  position: relative;
  height: ${props => props.x - 120}px;
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
  font-size: 15px;
  margin-top: 5px;
  font-family: "NunitoRegular";
  color: ${props => props.theme.secondaryTextColor};
`;

const CommentInput = styled(TextInput)`
  padding-left: 20px;
  border-radius: 999999999px;
  background-color: #efefef;
  color: #626262;
  flex: 1;
  height: 45px;
  margin: 0;
`;

const InputCommentSection = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const CommentsScreen = function(props) {
    const { show, showComment, post_id } = props;
    const { width, height } = Dimensions.get("screen");
    const { colors } = props.theme;
    const [commentState, setCommentState] = useState({
      msg: undefined,
      success: true,
      loading: false
    });
    const { loaded, err, error_msg, data } = useSelector(state => state.Comments);
    const [listComments, setComments] = useState([]);
    const swipeUpDownRef = useRef();

    const FetchComments = function() {
      console.log("POID: ", post_id);
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

    const SendComment = function() {
      axiosConfig(NEW_COMMENTS, "post", {
        post_id: post_id,
        content: commentState.msg,
        media: []
      })
        .then(r => {
          FetchComments();
        })
        .catch(e => console.error(e.response.data));
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
                    <CommentUsername>
                      {data.display_name}
                      &nbsp;
                      {
                        moment.duration(moment().diff(moment(data.created_at))).asMinutes() < 1
                          ? <PostTimestamp>Just now</PostTimestamp>
                          :moment.duration(moment().diff(moment(data.created_at))).asHours() < 1
                            ? <PostTimestamp theme={colors}>{Math.round(moment.duration(moment().diff(moment(data.created_at))).asMinutes())}m ago</PostTimestamp>
                            : moment.duration(moment().diff(moment(data.created_at))).asHours() < 24
                              ? <PostTimestamp theme={colors}>{Math.round(moment.duration(moment().diff(moment(data.created_at))).asHours())}h ago</PostTimestamp>
                              : <PostTimestamp theme={colors}>{moment(data.created_at).format("MMM DD hh:mm A")}</PostTimestamp>
                      }
                    </CommentUsername>

                    <CommentContent theme={colors}>{data.content}</CommentContent>
                </ContentWrapper>
            </CommentWrapper>
        );
    }

    const Comments = function() {
        return (
            <CommentSection x={height}>
              <Text style={{fontSize: 25, fontFamily: "NunitoSemiBold", color: "black"}}>Comments ({listComments.length})</Text>
              <InputCommentSection>
                {/*<IconButton*/}
                {/*  onPress={() => {}}*/}
                {/*  style={{marginRight: 10}}*/}
                {/*  icon={"phone"}*/}
                {/*  color={colors.positiveBgColor}*/}
                {/*/>*/}
                <CommentInput placeholder={"Write a comment ..."} defaultValue={commentState.msg}  placeholderTextColor={"#b4b4b4"} onChangeText={e => {
                  setCommentState({
                    ...commentState,
                    msg: e
                  })
                }}/>
                <IconButton
                  onPress={SendComment}
                  icon={"send"}
                  color={colors.positiveBgColor}
                  style={{
                    marginRight: 10,
                    transform: [{rotate: '-35deg'}],
                    paddingLeft: 2,
                    backgroundColor:"#d4fdff"
                  }}
                />
              </InputCommentSection>
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
        console.log("Iam calling");
          swipeUpDownRef.current.showFull();
          const p1 = FetchComments();
          return(() => {
            p1.controller.abort();
          })
        }
    }, [show]);

    return(
        <SwipeUpDown
            itemFull={
              <CommentSection x={height}>
                <Text style={{fontSize: 25, fontFamily: "NunitoSemiBold", color: "black"}}>Comments ({listComments.length})</Text>
                <InputCommentSection>
                  {/*<IconButton*/}
                  {/*  onPress={() => {}}*/}
                  {/*  style={{marginRight: 10}}*/}
                  {/*  icon={"phone"}*/}
                  {/*  color={colors.positiveBgColor}*/}
                  {/*/>*/}
                  <CommentInput placeholder={"Write a comment ..."} defaultValue={commentState.msg}  placeholderTextColor={"#b4b4b4"} onChangeText={e => {
                    setCommentState({
                      ...commentState,
                      msg: e
                    })
                  }}/>
                  <IconButton
                    onPress={SendComment}
                    icon={"send"}
                    color={colors.positiveBgColor}
                    style={{
                      marginRight: 10,
                      transform: [{rotate: '-35deg'}],
                      paddingLeft: 2,
                      backgroundColor:"#d4fdff"
                    }}
                  />
                </InputCommentSection>
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
            }
            swipeHeight={height}
            ref={swipeUpDownRef}
            extraMarginTop={10}
            disableSwipeIcon={false}
            iconColor='gray'
            iconSize={25}
            onShowMini={() => showComment(false)}
            animation="spring"
            style={{backgroundColor: "#FFF", zIndex: 10}}
        />
    );
}

export default withTheme(CommentsScreen);
