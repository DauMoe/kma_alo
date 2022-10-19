import React, {Fragment, useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Dimensions,
  Image,
  PermissionsAndroid, ToastAndroid,
} from "react-native";
import styled from "styled-components/native";
import { Avatar, Button, IconButton, withTheme } from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";
import uuid from "react-native-uuid";
import LinearGradient from "react-native-linear-gradient";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GetChatHistory} from "../ReduxSaga/Chat/Actions";
import { GET_CHAT_HISTORY, GET_CHAT_INFO } from "../API_Definition";
import jwt_decode from "jwt-decode";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import Authenticator from "../ReduxSaga/Authenticator/Reducers";
import { VIDEO_CALL_SCREEN } from "../Definition";
import { launchImageLibrary } from "react-native-image-picker";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787"
}

const ChatHeadWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
    background-color: transparent;
    justify-content: space-between;
`;

const ChatHeadUsername = styled(Text)`
    font-family: "NunitoExtraBold";
    font-size: 22px;
    color: ${Theme.primaryTextColor}
`;

const ChatScreenWrapper = styled(View)`
  padding: 0 10px;
  background-color: ${Theme.primaryColor};
  position: relative;
  flex: 1;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ChatMessageWrapper = styled(View)`
  margin-top: ${props => props.isSameSender ? "2px" : "20px"};
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  align-self: ${props => props.sender ? "flex-end" : "flex-start"};
`;

const ChatMessage = styled(TouchableHighlight)`
  padding: ${props => props.isImage ? 0 : "8px 10px"};
  background-color: ${props => props.isImage ? undefined : props.sender ? "blueviolet" : "#b6b6b6"};
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
  border-bottom-right-radius: ${props => props.sender ? "0px" : "15px"};
  border-top-left-radius: ${props => props.sender ? "15px" : "0px"};
  margin-right: 5px;
`;

const InputMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: ${Theme.primaryColor};
  align-items: center;
  padding: 5px 0;
`;

const InputMessage = styled(TextInput)`
  flex: 1;
  margin: 0 0 0 10px;
  padding: 5px 10px;
  border-radius: 50px;
  background-color: #ececec;
  border-width: 1px;
  border-color: #6e6e6e;
  color: black
`;

const AvatarMessageUser = styled(Avatar.Text)`
  opacity: ${props => props.visible ? 1 : 0};
  margin-right: 10px;
`;

const MessageState = {
    SENDING : "SENDING",
    SENT    : "SENT",
    RECEIVED: "RECEIVED",
    SEEN    : "SEEN"
}

const ChatScreen = function(props) {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiaG9hbmduZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRhdW1vZSIsImlhdCI6MTY1NjI1NjA5NywiZXhwIjoxODcyMjU2MDk3fQ.cotV9sFZeH5p3w-iu25mE2FGxw2id0VOfEwWCVmNQy4";
    const navigation                = useNavigation();
    const route                     = useRoute();
    const { colors }                = props.theme;
    const { token }                 = useSelector(state => state.Authenticator);
    const { uid, room_chat_id }     = route.params;
    const limitMessage              = 20; //Load 20 message each time
    const [socket, setSocket]       = useState(null);
    const [msg, setMsg]             = useState("");
    const [Conversation, setConversation] = useState([]);
    const isFocus                   = useIsFocused();
    const ChatInfo                  = useRef({});
    const conversationAction        = useRef({
       offset: 0,
       loading: false
    });
    const [jwtInfo, setJwtInfo] = useState({
        uid: -1,
        username: ""
    });
    const [loading, setLoading] = useState({
      connectSocket: false,
      loadedHistory: false
    })
    const scrollViewRef = useRef();
    // const { receiver_avatar, receiver_avatar_text, room_chat_id, receiver_first_name, receiver_last_name, type, receiver_uid, receiver_username } = chatInfo;

    const HandleScrollTop = function(e) {
        // if (e.nativeEvent.contentOffset.y === 0 && !conversationAction.current.loading) LoadChatHistory()
    }

    const DecodeJWT = function() {
        const jwtData = jwt_decode(token);
        setJwtInfo(jwtData);
    }

    const Go2CallScreen = function() {
        navigation.push(VIDEO_CALL_SCREEN, {
            chatInfo: ChatInfo.current
        });
    }

    const GetChatInfo = () => {
        const controller = new AbortController();
        const fetch = axiosConfig(GET_CHAT_INFO, "get", {
            params: {
                to_uid: uid
            },
            signal: controller.signal
        });
        return { controller, fetch };
    }

    const LoadChatHistory = function() {
        conversationAction.current.loading = true;
        const controller = new AbortController();
        const options = {
            params: {
                offset: conversationAction.current.offset,
                limit: limitMessage,
                receiver_id: ChatInfo.current?.receiver_uid
            },
            signal: controller.signal
        }
        axiosConfig(GET_CHAT_HISTORY, "get", options)
            .then(r => {
                const respData = r.data.data;
                conversationAction.current.offset = respData.next_offset;
                const chatHistory = Array.isArray(respData.chat_history) ? respData.chat_history : [];
                setConversation(prevState => chatHistory.concat(prevState));
            })
            .catch(e => console.error(e.response.data))
            .finally(() => {
                conversationAction.current.loading = false;
            });
        return controller;
    }

    const HandleChatSocket = function(receiveData) {
        const newMessage = {
            ...receiveData,
            sender: receiveData.sender_id === jwtInfo.uid
        };
        setConversation(prevState => [...prevState, newMessage]);
    }

  const sendMessage = function() {
    if (msg.trim() === "") return;
    const newMessage = {
      ...ChatInfo.current,
      sender_id: jwtInfo.uid,
      msgID   : uuid.v1(),
      msg     : msg,
      sender  : true,
      state   : MessageState.SENT
    };
    setMsg("");
    setConversation(prevState => [...prevState, newMessage]);
    console.log(`socket.emit(emit_private_chat, ${jwtInfo.uid}, ${room_chat_id}, ${msg},  ${ChatInfo.current?.receiver_uid},  ${ChatInfo.current}, TEXT)`)
    socket.emit("emit_private_chat", jwtInfo.uid, room_chat_id, msg,  ChatInfo.current?.receiver_uid,  ChatInfo.current, "TEXT");
  }

  const ChatHeadSection = function() {
    return(
      <ChatHeadWrapper>
        <IconButton icon="chevron-left" size={35} onPress={() => {if (navigation.canGoBack()) navigation.goBack()}} color={Theme.primaryTextColor}/>
        <ChatHeadUsername>{ChatInfo.current?.receiver_first_name} {ChatInfo.current?.receiver_last_name}</ChatHeadUsername>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <IconButton
            onPress={Go2CallScreen}
            style={{marginRight: 10}}
            icon={"phone"}
            color={colors.positiveBgColor}
          />
          {
            ChatInfo.current?.receiver_avatar_link === ""
              ? <Avatar.Text size={30} label={ChatInfo.current?.receiver_avatar_text} style={{marginRight: 10}}/>
              : <Image source={{uri: DEFAULT_BASE_URL + ChatInfo.current?.receiver_avatar_link}} style={{width: 30, height: 30, borderRadius: 9999, marginRight: 10}}/>
          }
        </View>
      </ChatHeadWrapper>
    );
  }

  const chooseImage = function() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
        title: "Get image from library",
        message:
          "This app would like to view your photos.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "Allow"
      }
    )
      .then(async() => {
        try {
          const result = await launchImageLibrary({
            "mediaType": "photo",
            "cameraType": "front",
            "quality": 0.3,
            "includeBase64": true
          });
          HandleImage(result);
        } catch(e) {
          console.error("Launch library err: ", e);
        }
      })
      .catch(e => console.error(e))
  }

  const HandleImage = function(result) {
    if (result.didCancel) {
      console.info("User canceled");
    } else if (result.errorCode === "camera_unavailable") {
      ToastAndroid.show("Camera is not available", ToastAndroid.LONG);
    } else if (result.errorCode === "permission") {
      ToastAndroid.show("Please allow us access camera or gallery", ToastAndroid.LONG);
    } else if (result.errorCode === "others") {
      ToastAndroid.show(result.errorMessage, ToastAndroid.LONG);
    } else if ((result.assets[0].fileSize/1000) > 1000 * 10) {
      ToastAndroid.show("Image file is too large (Max: 10MB)", ToastAndroid.LONG);
    } else {
      const avatarBase64 = "data:image/png;base64," + result.assets[0].base64;
      SendImageMessage(avatarBase64);
    }
  }

  const SendImageMessage = function(base64) {
    const newMessage = {
      ...ChatInfo.current,
      sender_id: jwtInfo.uid,
      msgID   : uuid.v1(),
      base64  : base64,
      type    : "IMAGE",
      sender  : true,
      state   : "SEEN"
    };
    setMsg("");
    setConversation(prevState => [...prevState, newMessage]);
    socket.emit("emit_private_chat", jwtInfo.uid, room_chat_id, base64, ChatInfo.current?.receiver_uid, ChatInfo.current, "IMAGE");
  }

  useEffect(function () {
    const p1 = GetChatInfo();

    let controller, newSocket;
    Promise.all([p1.fetch])
      .then(r => {
        const ConversationInfo = r[0].data.data;
        ChatInfo.current = {
            ...ChatInfo.current,
            ...ConversationInfo
        };
        console.log("ROOM CHAT ID: ", room_chat_id);
        newSocket = io(`${DEFAULT_BASE_URL}/private`, {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax : 5000,
          reconnectionAttempts: 99999
        });
        newSocket.emit("join_chat", {room_name: room_chat_id});
        console.log(`newSocket.emit("join_chat", {room_name: ${room_chat_id}});`);
        newSocket.on("join_ok", function(code) {
          console.log("CODE:", code);
          if (code === 200) {
            setLoading({
              ...loading,
              connectSocket: true
            })
          }
        })
        newSocket.on("listen_private_chat", HandleChatSocket);
        setSocket(newSocket);
        DecodeJWT();
        controller = LoadChatHistory();
      })
      .catch(e => {
          console.error(e.response.data);
      });
    return (() => {
      newSocket?.close();
      p1.controller.abort();
      controller.abort();
    })
  }, [setSocket, token]);

  // if (!loading.connectSocket || !loading.loadedHistory) {
  //   return(
  //     <View>
  //
  //     </View>
  //   )
  // }

  return (
    <>
      <ChatHeadSection/>
      {/*<ChatSection/>*/}
      <ChatScreenWrapper>
        <ScrollView onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })} ref={scrollViewRef}>
          {/*<ScrollView onScroll={HandleScrollTop}>*/}
          {Array.isArray(Conversation) && Conversation.map(function(v, index) {
            return (
              <ChatMessageWrapper key={index} sender={v.sender} isSameSender={index > 0  && (v.sender_id === Conversation[index-1].sender_id)}>
                {/*<AvatarMessageUser size={35} label={v.receiver_avatar_text} visible={!v.sender && (index === 0 || (index > 0 && v.sender_id !== Conversation[index-1].sender_id))}/>*/}
                {
                  ChatInfo.current?.receiver_avatar_link === ""
                    ? <AvatarMessageUser size={35} label={ChatInfo.current?.receiver_avatar_text} visible={!v.sender && (index === 0 || (index > 0 && v.sender_id !== Conversation[index-1].sender_id))}/>
                    : <Image source={{uri: DEFAULT_BASE_URL + ChatInfo.current?.receiver_avatar_link}} style={{width: 35, height: 35, borderRadius: 9999, marginRight: 10, opacity: (!v.sender && (index === 0 || (index > 0 && v.sender_id !== Conversation[index-1].sender_id)) ? 1 : 0)}}/>
                }
                <ChatMessage isImage={v.type === "IMAGE"} sender={v.sender} onLongPress={() => console.log("Long press")}>
                  {v.type === "IMAGE"
                    ? <Image
                      source={{uri: v.base64 ? v.base64 : `${DEFAULT_BASE_URL}${v.msg}`}}
                      style={{
                        width: 150,
                        height: 200,
                        borderRadius: 10
                      }}/>
                    : <Text style={{color: "white"}}>{v.msg}</Text>
                  }
                </ChatMessage>
              </ChatMessageWrapper>
            )
          })}
        </ScrollView>
      </ChatScreenWrapper>
      <InputMessageWrapper>
        <IconButton
          icon="image"
          style={{
            padding: 0,
            margin: 0,
            marginLeft: 5
          }}
          size={30}
          onPress={chooseImage}
          animate={true}
          color={"#626262"}/>
          <InputMessage placeholderTextColor={"#6e6e6e"} defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
          <IconButton
            icon="send"
            style={{
              transform: [{rotate: '-35deg'}],
              padding: 0,
              margin: 0,
              marginLeft: 5,
              marginRight: 5,
              paddingLeft: 7,
              backgroundColor:"#d4fdff"
            }}
            size={30}
            onPress={sendMessage}
            animate={true}
            color={"#21a3d5"}/>
      </InputMessageWrapper>
    </>
  );
}

export default withTheme(ChatScreen);
