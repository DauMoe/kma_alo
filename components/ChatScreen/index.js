import React, {Fragment, useEffect, useState} from "react";
import {View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions} from "react-native";
import styled from "styled-components/native";
import {Avatar, Button, IconButton} from "react-native-paper";
import {useDispatch} from "react-redux";
import io from "socket.io-client";
import { v1 as uuidv1 } from "react-native-uuid";

// const ThemeColor = "#767676";
const ThemeColor = "#FFFFFF";

const ChatHeadWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    background-color: ${ThemeColor};
`;

const ChatHeadInfo = styled(View)`
    flex: 1;
`;

const ChatHeadUsername = styled(Text)`
    font-family: "NunitoExtraBold";
    font-size: 18px;
`;

const ChatHeadStatus = styled(Text)`
    font-size: 12px;
    color: gray;
    font-family: "NunitoBold";
`;

const ChatHeadOption = styled(View)`
  align-self: flex-end;
`;

const ChatScreenWrapper = styled(ScrollView)`
  padding: 10px 5px;
  background-color: ${ThemeColor};
`;

const ChatMessageWrapper = styled(View)`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-self: ${props => props.sender ? "flex-end" : "flex-start"};
`;

const ChatMessage = styled(TouchableHighlight)`
  padding: 8px 10px;
  background-color: blueviolet;
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
`;

const InputMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: ${ThemeColor};
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

const MessageState = {
    SENT    : "SENT",
    RECEIVED: "RECEIVED",
    SEEN    : "SEEN"
}

const ChatScreen = function(props) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiaG9hbmduZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRhdW1vZSIsImlhdCI6MTY1NjI1NjA5NywiZXhwIjoxODcyMjU2MDk3fQ.cotV9sFZeH5p3w-iu25mE2FGxw2id0VOfEwWCVmNQy4";
    const { route, navigation }     = props;
    const { chatInfo }              = route.params;
    const { width, height }         = Dimensions.get("window");
    const dispatch                  = useDispatch();
    const [socket, setSocket]       = useState(null);
    const [msg, setMsg]             = useState("??? WTF bro");
    const [Conversation, setConversation] = useState([]);
    const { avatar, avatar_text, emit_event_id, first_name, last_name, listen_event_id, type, uid, username } = chatInfo;

    const HandleChatSocket = function(receiveData) {
        const senderUid = receiveData.uid;
        const receiveMsg = receiveData.msg;
        const newMessage = {
            ...chatInfo,
            msg     : receiveMsg,
            sender  : senderUid === uid
        };
        setConversation(prevState => [...prevState, newMessage]);
    }

    const sendMessage = function() {
        if (msg.trim() === "") return;
        const newMessage = {
            ...chatInfo,
            msgID   : uuidv1(),
            msg     : msg,
            sender  : true,
            state   : MessageState.SENT
        };
        setMsg("");
        setConversation(prevState => [...prevState, newMessage]);
        socket.emit(emit_event_id, {uid: uid, msg: msg});
    }

    const ChatHeadSection = function() {
        return(
            <ChatHeadWrapper>
                <Avatar.Text size={40} label="DM" style={{marginRight: 10}}/>
                <ChatHeadInfo>
                    <ChatHeadUsername>Daumoe</ChatHeadUsername>
                    <ChatHeadStatus>Active now</ChatHeadStatus>
                </ChatHeadInfo>
                <ChatHeadOption>
                    <IconButton icon="dots-vertical" color={"#FFFFFF"}></IconButton>
                </ChatHeadOption>
            </ChatHeadWrapper>
        );
    }

    const ChatSection = function() {
        return(
            <ChatScreenWrapper>
                {Array.isArray(Conversation) && Conversation.map(function(v, index) {
                    return (
                        <ChatMessageWrapper key={index} sender={v.sender}>
                            {!v.sender ? <Avatar.Text size={35} label={v.avatar_text} style={{marginRight: 10}}/> : undefined}
                            <ChatMessage onLongPress={() => console.log("Long press")}>
                                <Text style={{color: "white"}}>{v.msg}</Text>
                            </ChatMessage>
                            {v.sender && <IconButton icon="check-circle-outline" size={15} color={"gray"}/>}
                        </ChatMessageWrapper>
                    )
                })}
            </ChatScreenWrapper>
        );
    }

    const InputMessageSection = function() {
        return (
            <InputMessageWrapper>
                <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
                <IconButton icon="send" style={{transform: [{rotate: '-30deg'}]}} size={25} onPress={sendMessage} animate={true} color={"#E4E4E4"}/>
            </InputMessageWrapper>
        );
    }

    useEffect(function () {
        //CANNOT add token to header yet
        console.log("EMIT ID: ", emit_event_id);
        console.log("LISTEN ID: ", listen_event_id);

        const newSocket = io("http://192.168.1.36:8080/private", {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        newSocket.emit("new_private_chat", {emit_event_id, listen_event_id});
        newSocket.on(listen_event_id, HandleChatSocket);
        setSocket(newSocket);
        return function() {
            newSocket.close();
        }
    }, [setSocket]);

    return (
        <>
            <ChatHeadSection/>
            <ChatSection/>
            <InputMessageSection sendMessage={sendMessage}/>
        </>
    );
}

export default ChatScreen;