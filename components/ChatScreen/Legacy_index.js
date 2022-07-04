import React, {Fragment, useEffect, useState} from "react";
import {View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions} from "react-native";
import styled from "styled-components/native";
import {Avatar, Button, IconButton} from "react-native-paper";
import {useDispatch} from "react-redux";
import io from "socket.io-client";
import uuid from "react-native-uuid";
import LinearGradient from "react-native-linear-gradient";
import {DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";

const Theme = {
    primaryColor: "rgba(0, 108, 115, 1)",
    secondaryColor: "",
    primaryTextColor: "#FFFFFF",
    secondaryTextColor: "#CACACA"
}

const ChatHeadWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px 0 20px 0;
    background-color: ${Theme.primaryColor};
`;

const ChatHeadInfo = styled(View)`
    flex: 1;
`;

const ChatHeadUsername = styled(Text)`
    font-family: "NunitoExtraBold";
    font-size: 18px;
    color: ${Theme.primaryTextColor}
`;

const ChatHeadStatus = styled(Text)`
    font-size: 12px;
    color: gray;
    font-family: "NunitoBold";
  color: ${Theme.secondaryTextColor}
`;

const ChatHeadOption = styled(View)`
  align-self: flex-end;
`;

const ChatScreenWrapper = styled(View)`
  padding: 10px 5px;
  background-color: transparent;
  position: relative;
  flex: 1;
`;

const ChatMessageWrapper = styled(View)`
  margin-top: ${props => props.isSameSender ? "2px" : "20px"};
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
    const { width, height }         = Dimensions.get("window");
    const dispatch                  = useDispatch();
    const [socket, setSocket]       = useState(null);
    const [msg, setMsg]             = useState("??? WTF bro");
    const [Conversation, setConversation] = useState([]);
    const { avatar, avatar_text, emit_event_id, first_name, last_name, listen_event_id, type, uid, username } = chatInfo;

    const HandleChatSocket = function(receiveData) {
        console.log("R: ", receiveData);
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
            msgID   : uuid.v1(),
            msg     : msg,
            sender  : true,
            state   : MessageState.SENDING
        };
        setMsg("");
        setConversation(prevState => [...prevState, newMessage]);
        socket.emit(emit_event_id, {uid: uid, msg: msg});
    }

    const ChatHeadSection = function() {
        return(
            <ChatHeadWrapper>
                <IconButton icon="keyboard-backspace" size={25} onPress={() => navigation.goBack()} color={Theme.primaryTextColor}/>
                <Avatar.Text size={40} label="DM" style={{marginRight: 10}}/>
                <ChatHeadInfo>
                    <ChatHeadUsername>Daumoe</ChatHeadUsername>
                    <ChatHeadStatus>Active now</ChatHeadStatus>
                </ChatHeadInfo>
                <ChatHeadOption>
                    <IconButton icon="dots-vertical" color={Theme.primaryTextColor}/>
                </ChatHeadOption>
            </ChatHeadWrapper>
        );
    }

    const ChatSection = function() {
        return(
            <ChatScreenWrapper>
                <LinearGradient
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }}
                    colors={["rgba(80, 219, 228, 0.9)", "rgba(80, 219, 228, 0.9)", "rgba(80, 219, 228, 0.9)"]}
                />
                <ScrollView>
                    {Array.isArray(Conversation) && Conversation.map(function(v, index) {
                        return (
                            <ChatMessageWrapper key={index} sender={v.sender} isSameSender={index > 0  && (v.uid === Conversation[index-1].uid)}>
                                {!v.sender ? <Avatar.Text size={35} label={v.avatar_text} style={{marginRight: 10}}/> : undefined}
                                <ChatMessage onLongPress={() => console.log("Long press")}>
                                    <Text style={{color: "white"}}>{v.msg}</Text>
                                </ChatMessage>
                                {v.sender && <IconButton icon="check-circle-outline" size={15} color={"gray"}/>}
                            </ChatMessageWrapper>
                        )
                    })}
                </ScrollView>
            </ChatScreenWrapper>
        );
    }

    const InputMessageSection = function() {
        return (
            <InputMessageWrapper>
                <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
                <IconButton
                    icon="send"
                    style={{
                        transform: [{rotate: '-30deg'}]
                    }}
                    size={25}
                    onPress={sendMessage}
                    animate={true}
                    color={Theme.primaryTextColor}/>
            </InputMessageWrapper>
        );
    }

    useEffect(function () {
        console.log("CHAT: ", {emit_event_id, listen_event_id});

        const newSocket = io(`${DEFAULT_BASE_URL}/private`, {
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
            {/*<InputMessageSection sendMessage={sendMessage}/>*/}
        </>
    );
}

export default ChatScreen;