import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Button,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    InteractionManager, FlatList,
} from "react-native";
import styled from "styled-components/native";
import {Avatar, IconButton, TextInput as TextInputRNP} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {GetListChats} from "../ReduxSaga/Chat/Actions";
import {CHAT_SCREEN} from "../Definition";
import 'moment-timezone';
import moment from "moment";
import {useFocusEffect, useIsFocused, useNavigation} from "@react-navigation/native";
import lodash from "lodash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { axiosConfig, DEFAULT_BASE_URL } from "../ReduxSaga/AxiosConfig";
import { SEARCH_FRIEND } from "../API_Definition";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787",
    helpTextColor: "#b2b2b2"
}

const ChatHeadSectionWrapper = styled(View)`
  color: ${Theme.primaryTextColor};
  display: flex;
  flex-direction: row;
  padding: 20px 15px;
  align-content: center;
`;

const ChatHeadUsername = styled(Text)`
  font-family: "NunitoExtraBold";
  font-size: 28px;
  color: ${Theme.primaryTextColor}
`;

const SearchChatSectionWrapper = styled(View)`
  width: 100%;
  padding: 0 20px 10px 20px;
`;

const SearchChatInput = styled(TextInput)`
  padding-left: 20px;
  border-radius: 999999999px;
  background-color: #efefef;
  color: #626262;
`;

const ListChatSectionWrapper = styled(ScrollView)`

`;

const PreviewChatWrapper = styled(View)`
    padding: 20px 10px 0 10px;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const PreviewChatContent = styled(View)`
    flex: 1;
`;

const ChatUsername = styled(Text)`
  font-family: "NunitoBold";
  font-size: 18px;
  color: ${Theme.primaryTextColor};
`;

const PreviewMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  padding-right: 5px;
`;

const PreviewMessage = styled(Text)`
  font-family: "NunitoRegular";
  color: ${props => props.unread ? "#464141" : Theme.secondaryTextColor};
  flex: 1;
  font-weight: ${props => props.unread ? 700 : 400};
`;

const MessageTime = styled(Text)`
  color: ${Theme.helpTextColor};
`;

const LoadingChatScreen = function() {
    return (
        <>
            <View style={{
                backgroundColor: Theme.primaryColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingBottom: 10
            }}>
                <ChatHeadSectionWrapper>
                    <ChatHeadUsername>Message</ChatHeadUsername>
                </ChatHeadSectionWrapper>
                <SearchChatSectionWrapper>
                    <SkeletonPlaceholder>
                        <View style={{height: 50, borderRadius: 999999, paddingLeft: 40, paddingRight: 40}}></View>
                    </SkeletonPlaceholder>
                </SearchChatSectionWrapper>
            </View>
            <ListChatSectionWrapper>
                <SkeletonPlaceholder>
                    {Array(10).fill(1).map(function(v, index) {
                        return(
                            <View key={"_loading_chat_" + index} style={{paddingTop: 20, paddingLeft: 20, display: "flex", flexDirection: "row"}}>
                                <View style={{width: 50, height: 50, marginRight: 15, borderRadius: 9999}}></View>
                                <View style={{flex: 1, paddingRight: 30}}>
                                    <View style={{height: 20, width: 100, borderRadius: 10}}></View>
                                    <View style={{height: 20, marginTop: 10, borderRadius: 10}}></View>
                                </View>
                            </View>
                        );
                    })}
                </SkeletonPlaceholder>
            </ListChatSectionWrapper>
        </>
    );
}

const ListChatsScreen = function(props) {
  const navigation                            = useNavigation();
  const { width, height }                     = Dimensions.get("window");
  const dispatch                              = useDispatch();
  const { loaded, error, error_msg, data }    = useSelector(state => state.Chats);
  const [ListChat, setListChat]               = useState([]);
  const [searchResult, setResult]             = useState([]);
  const [searchChat, setSearchChat]           = useState("");
  const isMount                               = useRef();
  const isFocus                               = useIsFocused();

  const GotoChatScreen = function(uid, room_chat_id) {
      navigation.push(CHAT_SCREEN, {
          uid: uid,
          room_chat_id: room_chat_id
      });
  }

  const _findFriend = function(query) {
    axiosConfig(SEARCH_FRIEND, "get", {
      params: {
        q: query
      }
    })
      .then(r => {
        setResult(r.data.data.result);
      })
      .catch(e => console.log(e.response));
  }

  const _findFriendDebounce = useCallback(lodash.debounce(_findFriend, 500), []);

  const SearchChat = function(e) {
    setSearchChat(e??"");
    const query = e  ?? searchChat;
    if (query === "") {
      setResult(data);
    } else {
      _findFriendDebounce(query);
    }
  }

  useEffect(function() {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!isMount.current) {
        dispatch(GetListChats());
        isMount.current = true;
      } else {
        if (loaded && !error) {
          setListChat(data);
        }
      }
    });
    return () => task.cancel();
  }, [data, isFocus]);

  if (!loaded) return <LoadingChatScreen/>

  if (loaded && !error) {
    return(
      <>
        <View style={{
          backgroundColor: Theme.primaryColor,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingBottom: 10
        }}>
          <ChatHeadSectionWrapper>
            <ChatHeadUsername>Message</ChatHeadUsername>
          </ChatHeadSectionWrapper>
          <SearchChatSectionWrapper>
            <SearchChatInput placeholderTextColor={"#b4b4b4"} onChangeText={SearchChat} placeholder={"Find friends ..."}/>
          </SearchChatSectionWrapper>
        </View>

        {searchChat.trim() === "" ?
          <FlatList
            refreshing={!loaded}
            onRefresh={_ => dispatch(GetListChats())}
            ListEmptyComponent={<View style={{height: 200, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: "black", fontFamily: "NunitoSemiBold", fontSize: 16}}>Ops! No conversations</Text></View>}
            data={ListChat}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => GotoChatScreen(item.receiver_uid, item.room_chat_id)} key={"__chat_no_" + index}>
                <PreviewChatWrapper>
                  {item.receiver_avatar === ""
                    ? <Avatar.Text size={50} label={item.receiver_avatar_text} style={{ marginRight: 15 }} />
                    : <Image source={{ uri: DEFAULT_BASE_URL + item.receiver_avatar }} style={{ width: 50, height: 50, borderRadius: 99999, marginRight: 15 }} />
                  }
                  <PreviewChatContent>
                    <ChatUsername>{item.display_name}</ChatUsername>
                    <PreviewMessageWrapper>
                      <PreviewMessage unread={item.status === "UNREAD"}>{item.last_message}</PreviewMessage>
                      <MessageTime>{moment(item.last_send).isValid() && moment(item.last_send).format("HH:MM")}</MessageTime>
                    </PreviewMessageWrapper>
                  </PreviewChatContent>
                  {/*<IconButton icon="check-circle" size={15} color={"gray"}/>*/}
                  {/*<IconButton icon="check-circle-outline" size={15} color={"gray"}/>*/}
                </PreviewChatWrapper>
              </TouchableOpacity>
            )}
          />
          :
          <FlatList
            // refreshing={false}
            // onRefresh={SearchChat}
            ListEmptyComponent={<View style={{height: 200, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: "black", fontFamily: "NunitoSemiBold", fontSize: 16}}>No result</Text></View>}
            data={searchResult}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => GotoChatScreen(item.uid, item.room_chat_id)} key={"__chat_no_" + index}>
                <PreviewChatWrapper>
                  {item.avatar_link === ""
                    ? <Avatar.Text size={50} label={item.avatar_link} style={{ marginRight: 15 }} />
                    : <Image source={{ uri: DEFAULT_BASE_URL + item.avatar_link }} style={{ width: 50, height: 50, borderRadius: 99999, marginRight: 15 }} />
                  }
                  <PreviewChatContent>
                    <ChatUsername>{item.display_name}</ChatUsername>
                  </PreviewChatContent>
                </PreviewChatWrapper>
              </TouchableOpacity>
            )}
          />
        }
      </>
    );
  }

  if (error) {
    return(
      <View style={{height: height, display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center"}}><Text style={{color: "red"}}>{error_msg}</Text></View>
    );
  }
}

export default ListChatsScreen;
