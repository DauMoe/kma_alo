import React, {useEffect, useRef, useState} from "react";
import {View, ScrollView, Dimensions, Text, TouchableOpacity, FlatList, InteractionManager} from "react-native";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';
import CommentsScreen from "./CommentScreen";
import {useFocusEffect, useIsFocused, useNavigation} from "@react-navigation/native";
import {CREATE_POST_SCREEN, EDIT_USER_PROFILE_SCREEN, LOGIN_SCREEN} from "../Definition";
import {Button, FAB, HelperText, Modal, Portal, Provider, withTheme} from "react-native-paper";
import {WebView} from "react-native-webview";
import AutoHeightWebView from "react-native-autoheight-webview";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import lodash from "lodash";
import jwt_decode from "jwt-decode";
import {DELETE_POSTS, GET_POSTS, REACT_POST} from "../API_Definition";
import {useSelector} from "react-redux";

const NewsFeedWrapper = styled(View)`
    //height: ${props => props.height + "px"};
    position: relative;
`;

const CreatePostWrapper = styled(TouchableOpacity)`
  padding: 20px 30px;
  background-color: white;
  margin-top: 5px;
  border-radius: 5px;
`;

const NewsFeedScreen = function(props) {
    const { colors }                = props.theme;
    const navigation                = useNavigation();
    const { token }                 = useSelector(state => state.Authenticator);
    const jwtData                   = jwt_decode(token);
    const { width, height }         = Dimensions.get("window");
    const [openComment, setOpen]    = useState({
        show: false,
        post_id: -1
    });
    const [listPost, setPost]       = useState([]);
    const isFocus                   = useIsFocused();
    const [isLoading, setLoading]   = useState(false);
    const [openModal, setOpenModal] = useState({
        state: false,
        post_id: -1
    });
    const currentState              = useRef({
        offset  : 0,
        limit   : 10
    });

    const openCommentScreen = function(show, post_id) {
        setOpen({
            post_id: post_id,
            show: show
        });
    }

    const Go2CreatePost = function() {
        try {
            navigation.push(CREATE_POST_SCREEN);
        } catch (e) {
            console.error("D: ", e);
        }
    }

    const FetchPost = function(refresh = false) {
        if (refresh) setLoading(true);
        const controller = new AbortController();
        axiosConfig(GET_POSTS, "get", {
            signal: controller.signal,
            params: {
                offset  : refresh ? 0 : currentState.current.offset,
                limit   : refresh ? 10: currentState.current.limit
            }
        })
            .then(r => {
                const ListPost = [];
                for(const post of r.data.data.list_post) {
                    const item = post;
                    item.reacted = false;
                    if (lodash.find(post.reactions, v => v.uid === jwtData.uid)) {
                        item.reacted = true;
                    }
                    ListPost.push(item);
                }
                if (refresh) {
                    setPost(ListPost);
                } else {
                    setPost([...listPost, ...ListPost]);
                }
                currentState.current.offset = r.data.data.offset;
                currentState.current.limit  = r.data.data.limit;
            })
            .catch(e => {
                console.error(e.response.data);
            })
            .finally(() => {
                if (refresh) setLoading(false)
            });
        return controller;
    }

    const setModalState = (modalState, postId) => {
        setOpenModal({
            state: modalState,
            post_id: postId
        });
    }

    const DeletePost = () => {
        axiosConfig(DELETE_POSTS, "delete", {
            data: {
                post_id: openModal.post_id
            }
        })
            .then(r => {
                setModalState(false, -1);
                FetchPost(true);
            })
            .catch(e => {
                console.error(e.response.data);
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
                       uid: jwtData.uid
                    });
                    CloneListPost.splice(index, 1, ModifyItem);
                }
                setPost(CloneListPost);
            })
            .catch(e => console.error(e.response));
    }

    useFocusEffect(React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        const controller = FetchPost(true);
      });
      return(() => {
        task.cancel();
      });
    }, [isFocus]));

    return(
        <>
            <NewsFeedWrapper>
                <FlatList
                  data={listPost}
                  disableVirtualization={false}
                  keyExtractor={(item, index) => "_post_" + index}
                  onRefresh={() => FetchPost(true)}
                  refreshing={isLoading}
                  // onEndReachedThreshold={30}
                  // onEndReached={FetchPost}
                  ListEmptyComponent={!isLoading && <View style={{height: height, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: colors.text, fontFamily: "NunitoSemiBold"}}>Ops! No post. Let's find some friends</Text></View>}
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
                <FAB
                    small
                    icon="pencil"
                    onPress={Go2CreatePost}
                    // theme={{ colors: { accent: 'blue' } }}
                    style={{
                        zIndex: 9,
                        position: "absolute",
                        bottom: 20, right: 20
                    }}
                />
            </NewsFeedWrapper>
            <Provider>
                <Portal>
                    <Modal visible={openModal.state} onDismiss={() => setOpenModal({...openModal, state: false})} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 50, borderRadius: 10}}>
                        <Text style={{color: "black", fontFamily: "NunitoSemiBold", fontSize: 16}}>Do you want to delete this post?</Text>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Button onPress={DeletePost} mode='text' uppercase={false} color="red" style={{marginTop: 30, flex: 1}}>
                                Delete
                            </Button>
                            <Button onPress={() => setOpenModal({...openModal, state: false})} mode="text" color="gray" uppercase={false} style={{marginTop: 30, flex: 1}}>
                                Cancel
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </Provider>
        </>
    );
}

export default withTheme(NewsFeedScreen);
