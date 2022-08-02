import React, {useEffect, useRef, useState} from "react";
import {View, ScrollView, Dimensions, Text, TouchableOpacity, FlatList} from "react-native";
import SingleNews from "./SingleNews";
import styled from 'styled-components/native';
import CommentsScreen from "./CommentScreen";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {CREATE_POST_SCREEN, EDIT_USER_PROFILE_SCREEN, LOGIN_SCREEN} from "../Definition";
import { Button, FAB, HelperText, withTheme } from "react-native-paper";
import {WebView} from "react-native-webview";
import AutoHeightWebView from "react-native-autoheight-webview";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import {GET_POSTS} from "../API_Definition";

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
    const { width, height }         = Dimensions.get("window");
    const [openComment, setOpen]    = useState(false);
    const [listPost, setPost]       = useState([]);
    const isFocus                   = useIsFocused();
    const [isLoading, setLoading]   = useState(false);
    const currentState              = useRef({
        offset  : 0,
        limit   : 10
    });

    const openCommentScreen = function(show) {
        setOpen(show);
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
        axiosConfig(GET_POSTS, "get", {
            params: {
                offset  : refresh ? 0 : currentState.current.offset,
                limit   : refresh ? 10: currentState.current.limit
            }
        })
            .then(r => {
                setPost([...listPost, ...r.data.data.list_post]);
                currentState.current.offset = r.data.data.offset;
                currentState.current.limit  = r.data.data.limit;
            })
            .catch(e => {
                console.error(Object.keys(e));
                console.error(e.response)
            })
            .finally(() => {
                if (refresh) setLoading(false)
            });
    }

    useEffect(function() {
        FetchPost();
    }, [isFocus]);

    if (!__DEV__) {
      return (
        <View style={{display: "flex", alignItems: "center", justifyContent: "center", height: height}}>
          <Text style={{fontFamily: "NunitoSemiBold", color: "black"}}>Sorry, this feature is developing!</Text>
        </View>
      )
    }

    return(
        <NewsFeedWrapper>
            <FlatList
                data={listPost}
                keyExtractor={(item, index) => "_post_" + index}
                onRefresh={() => FetchPost(true)}
                refreshing={isLoading}
                // onEndReachedThreshold={30}
                // onEndReached={FetchPost}
                renderItem={({item, index}) => (
                    <SingleNews
                        width={width}
                        height={height}
                        data={item}
                        showComment={openCommentScreen}
                    />
                )}
            />
            <CommentsScreen show={openComment}/>
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
    );
}

export default withTheme(NewsFeedScreen);
