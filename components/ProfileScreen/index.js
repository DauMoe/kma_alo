import React, { useState } from "react";
import {ActivityIndicator, Avatar, Button, IconButton, withTheme} from "react-native-paper";
import {Dimensions, ScrollView, View, Text, Image, ImageBackground, FlatList, TouchableOpacity} from "react-native";
import styled from "styled-components";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import { axiosConfig, DEFAULT_BASE_URL } from "../ReduxSaga/AxiosConfig";
import {GET_POSTS, GET_USER_PROFILE, REACT_POST} from "../API_Definition";
import SingleNews from "../NewsFeedScreen/SingleNews";
import lodash from "lodash";
import {useSelector} from "react-redux";
import jwt_decode from "jwt-decode";
import CommentsScreen from "../NewsFeedScreen/CommentScreen";
import {CHAT_SCREEN} from "../Definition";

const ProfileScreen = function(props) {
  const { width, height }         = Dimensions.get("window");
  const { colors }                = props.theme;
  const navigation                = useNavigation();
  const route                     = useRoute();
  const {uid}                     = route.params;
  const [profileInfo, setProfile] = useState({});
  const [listPost, setPost]       = useState([]);
  const [openComment, setOpen]    = useState({
    show: false,
    post_id: -1
  });
  const { token }                 = useSelector(state => state.Authenticator);
  const jwtData                   = jwt_decode(token);

  const UserProfileScreen = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    position: relative;
  `;

  const UsernameProfile = styled(Text)`
    font-family: "NunitoBold";
    font-size: 25px;
    color: #333333;
  `;

  const ForeignBackground = function({link}) {
    if (link) {
      return(
        <>
          <View style={{position: "absolute", left: 0, right: 0, top: 0, height: '70%'}}>
            <Image source={{uri: DEFAULT_BASE_URL + link}} style={{width: '100%', height: '100%'}}/>
          </View>
          <View style={{position: "absolute", left: 10, top: 10, borderRadius: 999999999, backgroundColor: "white"}}>
            <IconButton icon="chevron-left" size={20} onPress={() => {if (navigation.canGoBack()) navigation.goBack()}} color={colors.primaryTextColor}/>
          </View>
        </>
      )
    }
    return (
      <>
        <View style={{position: "absolute", left: 0, right: 0, top: 0, height: '70%', backgroundColor: colors.primary}}></View>
        <View style={{position: "absolute", left: 10, top: 10, borderRadius: 999999999, backgroundColor: "white"}}>
          <IconButton icon="chevron-left" size={20} onPress={() => {if (navigation.canGoBack()) navigation.goBack()}} color={colors.primaryTextColor}/>
        </View>
      </>
    )
  }

  const FetchUserInfo = () => {
    const controller = new AbortController();
    const fetch = axiosConfig(GET_USER_PROFILE, "get", {
      signal: controller.signal,
      params: {
        uid: uid
      }
    });
    return { controller, fetch };
  }

  const GetListPost = () => {
    const controller= new AbortController();
    const fetch =  axiosConfig(GET_POSTS, "get", {
      params: {
        offset: 0,
        limit: 10,
        own_post: true,
        uid: uid
      },
      signal: controller.signal
    })
    return { controller, fetch };
  }

  useFocusEffect(
    React.useCallback(() => {
      const p1 = FetchUserInfo();
      const p2 = GetListPost();
      Promise.all([p1.fetch, p2.fetch])
        .then(r => {
          setProfile(r[0].data.data.user_data);
          const ListPost = [];
          for(const post of r[1].data.data.list_post) {
            const item = post;
            item.reacted = false;
            if (lodash.find(post.reactions, v => v.uid === jwtData.uid)) {
              item.reacted = true;
            }
            ListPost.push(item);
          }
          setPost(ListPost);
        })
        .catch(e => {
          console.error("E: ", e);
        })
      return(() => {
        p1.controller.abort();
        p2.controller.abort();
      })
    }, [])
  )

  const [openModal, setOpenModal] = useState({
    state: false,
    post_id: -1
  });

  const setModalState = (modalState, postId) => {
    setOpenModal({
      state: modalState,
      post_id: postId
    });
  }

  const openCommentScreen = function(show, post_id) {
    setOpen({
      post_id: post_id,
      show: show
    });
  }

  const Go2Chat = function() {
    navigation.navigate(CHAT_SCREEN, {
      uid: uid
    })
  }

  const reactionPost = function(post_id, type) {
    axiosConfig(REACT_POST, "post", {
      post_id, type
    })
      .then(r => {
        const index = lodash.findIndex(listPost, v => v.post_id === post_id);
        const CloneListPost = [...listPost];
        const ModifyItem = {...CloneListPost[index]};
        if (r.data.data.mode === "delete") {
          ModifyItem.reacted = false;
          lodash.remove(ModifyItem.reactions, v => v.uid === jwtData.uid);
          CloneListPost.splice(index, 1, ModifyItem);
        } else if (r.data.data.mode === "insert") {
          ModifyItem.reacted = true;
          ModifyItem.reactions.push({
            post_id: post_id,
            type: type,
            uid: uid
          });
          CloneListPost.splice(index, 1, ModifyItem);
        }
        setPost(CloneListPost);
      })
      .catch(e => console.error(e.response));
  }

  const NewMessage = function(uid) {
    navigation.push(CHAT_SCREEN, {
      uid: uid
    })
  }

  return(
    <View style={{height: height, width: width}}>
      <UserProfileScreen>
        <ForeignBackground link={profileInfo.avatar_link}/>
        {
          profileInfo.avatar_link
            ? <Image source={{uri: DEFAULT_BASE_URL + profileInfo.avatar_link}} style={{width: 120, height: 120, borderRadius: 99999, borderWidth: 3, borderColor: "white"}}/>
            : <Avatar.Text size={120} label={profileInfo.avatar_text} style={{borderWidth: 3, borderColor: "white"}}/>
        }
        <UsernameProfile>{profileInfo.first_name} {profileInfo.last_name}</UsernameProfile>
        <Button mode={"text"} uppercase={false} style={{backgroundColor: "gray"}} onPress={Go2Chat}>Message</Button>
      </UserProfileScreen>

      <FlatList
        style={{marginTop: 20}}
        ListEmptyComponent={<View style={{height: 200, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: colors.text, fontFamily: "NunitoSemiBold", fontSize: 16}}>Ops! This user has no post</Text></View>}
        data={listPost}
        keyExtractor={(item, index) => "_self_post_" + index}
        renderItem={({ item, index }) => (
          <SingleNews
            width={width}
            height={height}
            data={item}
            post_id={item.post_id}
            showComment={openCommentScreen}
            openDeleteModal={setModalState}
            reactionPost={reactionPost}
          />
        )}
      />
      <CommentsScreen showComment={openCommentScreen} show={openComment.show} post_id={openComment.post_id}/>
    </View>
  );
}

export default withTheme(ProfileScreen);
