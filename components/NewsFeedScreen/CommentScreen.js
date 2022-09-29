import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Avatar, IconButton, withTheme } from "react-native-paper";
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
  margin: 8px 0 0 0;
  background-color: #fafafa;
  padding: 10px;
  border-radius: 10px;
`;

const AvatarWrapper = styled(View)`

`;

const ContentWrapper = styled(View)`
  padding: 3px 0;
`;

const CommentSection = styled(View)`
  position: relative;
  display: flex;
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
  background-color: #f5f5f5;
  color: #626262;
  flex: 1;
  height: 45px;
  margin: 0;
`;

const InputCommentSection = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 20px 20px 0 20px;
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
    const [isLoading, setLoading] = useState(false);
    const swipeUpDownRef = useRef();

    const FetchComments = function() {
      setLoading(true);
      const controller = new AbortController();
      const fetch = axiosConfig(GET_COMMENTS, "get", {
          params: {
              post_id: post_id
          }
      })
        .then(r => {
            setComments(r.data.data);
        })
        .catch(e => console.error(e.response))
        .finally(() => {
          setLoading(false);
        })
      return { controller, fetch };
    }

    const SendComment = function() {
      if (commentState.msg) {
        setCommentState({
          ...commentState,
          msg: undefined
        });
        setLoading(true);
        axiosConfig(NEW_COMMENTS, "post", {
          post_id: post_id,
          content: commentState.msg,
          media: []
        })
          .then(r => {
            FetchComments();
          })
          .catch(e => {
            ToastAndroid.show(e.response.data, ToastAndroid.LONG);
            console.error(e.response.data);
          })
          .finally(() => setLoading(false));
      } else {
        ToastAndroid.show("Write comment", ToastAndroid.LONG);
      }
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
                          ? <PostTimestamp theme={colors}>Just now</PostTimestamp>
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

    const LoadingComment = function() {
      return(
        <View style={{height: height-270, width: width, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator animation size={40}/>
        </View>
      )
    }

    useEffect(function() {
      if(show) {
          // swipeUpDownRef.current.showFull();
          const p1 = FetchComments();
          return(() => {
            p1.controller.abort();
          })
        }
    }, [show]);

    if (!show) return <></>

    return (
      <View style={{
        height: height,
        width: width,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "white",
        zIndex: 10
      }}>
        <IconButton
          onPress={() => {
            showComment(false)
          }}
          icon={"window-close"}
          size={25}
          style={{
            position: "absolute",
            top: 10,
            right:10,
            zIndex: 200
          }}
        />
        <CommentSection>
          <Text style={{fontSize: 25, fontFamily: "NunitoSemiBold", color: "black", marginLeft: 20, marginTop: 20}}>Comments ({listComments.length})</Text>
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
          {
            isLoading
              ? <LoadingComment/>
              : <ScrollView style={{height: height-270, margin: 20}}>
                  {listComments.map((item, index) => {
                    return <CommentItem data={item} key={index}/>
                  })}
                </ScrollView>
          }
        </CommentSection>
      </View>
    )

    // return(
    //     <SwipeUpDown
    //         itemFull={
    //           <>
    //             <CommentSection>
    //               <Text style={{fontSize: 25, fontFamily: "NunitoSemiBold", color: "black", marginLeft: 20, marginTop: 20}}>Comments ({listComments.length})</Text>
    //               <InputCommentSection>
    //                 {/*<IconButton*/}
    //                 {/*  onPress={() => {}}*/}
    //                 {/*  style={{marginRight: 10}}*/}
    //                 {/*  icon={"phone"}*/}
    //                 {/*  color={colors.positiveBgColor}*/}
    //                 {/*/>*/}
    //                 <CommentInput placeholder={"Write a comment ..."} defaultValue={commentState.msg}  placeholderTextColor={"#b4b4b4"} onChangeText={e => {
    //                   setCommentState({
    //                     ...commentState,
    //                     msg: e
    //                   })
    //                 }}/>
    //                 <IconButton
    //                   onPress={SendComment}
    //                   icon={"send"}
    //                   color={colors.positiveBgColor}
    //                   style={{
    //                     marginRight: 10,
    //                     transform: [{rotate: '-35deg'}],
    //                     paddingLeft: 2,
    //                     backgroundColor:"#d4fdff"
    //                   }}
    //                 />
    //               </InputCommentSection>
    //               <ScrollView style={{height: 400}}>
    //                 {listComments.map((item, index) => {
    //                   return <CommentItem data={item} key={index}/>
    //                 })}
    //               </ScrollView>
    //             </CommentSection>
    //             {/*<FlatList*/}
    //             {/*  data={listComments}*/}
    //             {/*  keyExtractor={(item, index) => "_comments_" + index}*/}
    //             {/*  onRefresh={() => FetchComments()}*/}
    //             {/*  refreshing={isLoading}*/}
    //             {/*  ListEmptyComponent={!isLoading && <View style={{marginTop: 30, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: colors.text, fontFamily: "NunitoSemiBold"}}>No comments</Text></View>}*/}
    //             {/*  renderItem={({ item, index }) => (*/}
    //             {/*    !isLoading && <CommentItem data={item}/>*/}
    //             {/*  )}*/}
    //             {/*  contentContainerStyle={{*/}
    //             {/*    height: 200,*/}
    //             {/*    marginTop: 20*/}
    //             {/*  }}*/}
    //             {/*/>*/}
    //           </>
    //         }
    //         swipeHeight={height}
    //         ref={swipeUpDownRef}
    //         extraMarginTop={10}
    //         disableSwipeIcon={false}
    //         iconColor='gray'
    //         iconSize={25}
    //         onShowMini={() => showComment(false)}
    //         animation="spring"
    //         style={{backgroundColor: "#FFF", zIndex: 10}}
    //     />
    // );
}

export default withTheme(CommentsScreen);
