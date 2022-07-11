import React, {Fragment, useEffect, useRef, useState} from "react";
import {View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions} from "react-native";
import styled from "styled-components/native";
import {Avatar, Button, IconButton} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";
import uuid from "react-native-uuid";
import LinearGradient from "react-native-linear-gradient";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GetChatHistory} from "../ReduxSaga/Chat/Actions";
import {GET_CHAT_HISTORY} from "../API_Definition";
import jwt_decode from "jwt-decode";

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
  padding: 8px 10px;
  background-color: ${props => props.sender ? "blueviolet" : "#b6b6b6"};
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
  border-bottom-right-radius: ${props => props.sender ? "0px" : "15px"};
  border-top-left-radius: ${props => props.sender ? "15px" : "0px"};
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
  background-color: #B2B2B2;
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiaG9hbmduZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRhdW1vZSIsImlhdCI6MTY1NjI1NjA5NywiZXhwIjoxODcyMjU2MDk3fQ.cotV9sFZeH5p3w-iu25mE2FGxw2id0VOfEwWCVmNQy4";
    const { route, navigation }     = props;
    const { chatInfo }              = route.params;
    const limitMessage              = 20; //Load 20 message each time
    const [socket, setSocket]       = useState(null);
    const [msg, setMsg]             = useState("");
    const [Conversation, setConversation] = useState([]);
    const conversationAction = useRef({
       offset: 0,
       loading: false
    });
    const [jwtInfo, setJwtInfo] = useState({
        uid: -1,
        username: ""
    });
    const { receiver_avatar, receiver_avatar_text, room_chat_id, receiver_first_name, receiver_last_name, type, receiver_uid, receiver_username } = chatInfo;

    const HandleScrollTop = function(e) {
        if (e.nativeEvent.contentOffset.y === 0 && !conversationAction.current.loading) LoadChatHistory()
    }

    const DecodeJWT = function() {
        const jwtData = jwt_decode(token);
        setJwtInfo(jwtData);
    }

    useEffect(() => {
        DecodeJWT();
        LoadChatHistory();
    }, [token]);

    const LoadChatHistory = function() {
        // dispatch(GetChatHistory(offset, limitMessage));
        conversationAction.current.loading = true;
        const options = {
            params: {
                offset: conversationAction.current.offset,
                limit: limitMessage,
                receiver_id: receiver_uid
            }
        }
        axiosConfig(GET_CHAT_HISTORY, "get", options)
            .then(r => {
                const respData = r.data.data;
                conversationAction.current.offset = respData.next_offset;
                const chatHistory = Array.isArray(respData.chat_history) ? respData.chat_history : [];
                setConversation(prevState => chatHistory.concat(prevState));
            })
            .catch(e => console.error(e))
            .finally(() => {
                conversationAction.current.loading = false;
            });
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
            ...chatInfo,
            sender_id: jwtInfo.uid,
            msgID   : uuid.v1(),
            msg     : msg,
            sender  : true,
            state   : MessageState.SENT
        };
        setMsg("");
        setConversation(prevState => [...prevState, newMessage]);
        socket.emit("emit_private_chat", room_chat_id, msg, receiver_uid, chatInfo);
    }

    const ChatHeadSection = function() {
        return(
            <ChatHeadWrapper>
                <IconButton icon="chevron-left" size={35} onPress={() => navigation.goBack()} color={Theme.primaryTextColor}/>
                <ChatHeadUsername>{chatInfo.receiver_first_name} {chatInfo.receiver_last_name}</ChatHeadUsername>
                <Avatar.Text size={30} label={chatInfo.receiver_avatar_text} style={{marginRight: 10}}/>

            </ChatHeadWrapper>
        );
    }

    const ChatSection = function() {
        return(
            <ChatScreenWrapper>
                <ScrollView onScroll={HandleScrollTop}>
                    {Array.isArray(Conversation) && Conversation.map(function(v, index) {
                        return (
                            <ChatMessageWrapper key={index} sender={v.sender} isSameSender={index > 0  && (v.sender_id === Conversation[index-1].sender_id)}>
                                <AvatarMessageUser size={35} label={v.receiver_avatar_text} visible={!v.sender && (index === 0 || (index > 0 && v.sender_id !== Conversation[index-1].sender_id))}/>
                                <ChatMessage sender={v.sender} onLongPress={() => console.log("Long press")}>
                                    <Text style={{color: "white"}}>{v.msg}</Text>
                                </ChatMessage>
                                {v.sender && v.state === MessageState.SENDING && <IconButton icon="check-circle-outline" size={15} color={"gray"} style={{margin: 0}}/>}
                                {v.sender && v.state === MessageState.SENT && <IconButton icon="checkbox-marked-circle" size={15} color={"gray"} style={{margin: 0}}/>}
                            </ChatMessageWrapper>
                        )
                    })}
                </ScrollView>
            </ChatScreenWrapper>
        );
    }

    // const InputMessageSection = function() {
    //     return (
    //         <InputMessageWrapper>
    //             <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
    //             <IconButton
    //                 icon="send"
    //                 style={{
    //                     transform: [{rotate: '-30deg'}]
    //                 }}
    //                 size={25}
    //                 onPress={sendMessage}
    //                 animate={true}
    //                 color={Theme.primaryTextColor}/>
    //         </InputMessageWrapper>
    //     );
    // }

    useEffect(function () {
        console.log("Room name: ", room_chat_id);

        const newSocket = io(`${DEFAULT_BASE_URL}/private`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        newSocket.emit("join_chat", {room_name: room_chat_id});
        newSocket.on("listen_private_chat", HandleChatSocket);
        setSocket(newSocket);
        return function() {
            newSocket.close();
        }
    }, [setSocket]);

    return (
        <>
            <ChatHeadSection/>
            <ChatSection/>
            <InputMessageWrapper>
                <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
                <IconButton
                    icon="send"
                    style={{
                        transform: [{rotate: '-30deg'}],
                        backgroundColor: "#16878E",
                        marginLeft: 10,
                        marginRight: 10
                    }}
                    size={22}
                    onPress={sendMessage}
                    animate={true}
                    color={Theme.primaryTextColor}/>
            </InputMessageWrapper>
        </>
    );
}

export default ChatScreen;